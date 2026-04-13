import { createGoodsReceiptDtoForRegister } from "../../../dtos/goodsReceiptDto.js";
import { successCodeMessages } from "../../../messages/codeMessages.js";
import {
    cancelGoodsReceipt,
    confirmGoodsReceipt,
    createGoodsReceipt,
    findAllGoodsReceipts,
    updateGoodsReceipt
} from "../../../services/warehouse/goodsReceiptService.js";
import {
    createNotifications,
    createStockNotification,
    findDepartmentsForStockBroadcast,
    notifyProductStockStatusChanges
} from "../../../services/warehouse/notificationService.js";
import { emitStockUpdated } from "../../../utils/socketUtils.js";
import { sanitizeEmptyStrings } from "../../../utils/formattersUtils.js";

export const getAllGoodsReceipts = async (req, res) => {

    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const search = req.query['search[value]'] || '';

    const columns = ['receptionDate'];
    const orderColumnIndex = req.query.order?.[0]?.column || 0;
    const orderDir = req.query.order?.[0]?.dir || 'asc';

    const result = await findAllGoodsReceipts({
        skip: start,
        take: length,
        search,
        orderBy: columns[orderColumnIndex],
        orderDir
    });

    res.status(200).json(result);
}

export const registerGoodsReceipt = async (req, res) => {

    const goodsReceiptDto = createGoodsReceiptDtoForRegister(req.body);
    const sanitizedGoodsReceiptDto = sanitizeEmptyStrings(goodsReceiptDto);

    const goodsReceipt = await createGoodsReceipt(sanitizedGoodsReceiptDto);

    return res.status(200).json({
        goodsReceipt,
        code: successCodeMessages.CREATED_GOODS_RECEIPT
    });
}

export const editGoodsReceipt = async (req, res) => {

    const goodsReceiptDto = createGoodsReceiptDtoForRegister(req.body);
    const sanitizedGoodsReceiptDto = sanitizeEmptyStrings(goodsReceiptDto);

    const goodsReceipt = await updateGoodsReceipt(sanitizedGoodsReceiptDto, req.params.id);

    return res.status(200).json({
        goodsReceipt,
        code: successCodeMessages.UPDATED_GOODS_RECEIPT
    });
}

export const confirmGoodsReceiptStatus = async (req, res) => {

    const goodsReceipt = await confirmGoodsReceipt({ id: req.params.id, userId: req.userId });
    const productStockNotifications = await notifyProductStockStatusChanges({
        productIds: goodsReceipt.impactedProductIds || [],
        userId: req.userId
    });
    const restoredProductsCount = new Set(
        productStockNotifications
            .filter((notification) => notification.entityType === 'product-stock-restored')
            .map((notification) => notification.entityId)
    ).size;

    const warehouseNotification = await createStockNotification({
        title: 'Recepción confirmada',
        message: `La recepción ${goodsReceipt.referenceNumber} restauró el stock de ${restoredProductsCount} producto(s).`,
        referenceNumber: goodsReceipt.referenceNumber,
        entityId: goodsReceipt.id,
        entityType: 'goods-receipt-warehouse',
        userId: req.userId,
        departmentId: goodsReceipt.department?.id || null
    });

    const departments = await findDepartmentsForStockBroadcast();

    await createNotifications(
        departments.map((department) => ({
            title: 'Recepción de compra',
            message: `La recepción ${goodsReceipt.referenceNumber} restauró el stock de ${restoredProductsCount} producto(s).`,
            type: 'info',
            referenceNumber: goodsReceipt.referenceNumber,
            entityId: goodsReceipt.id,
            entityType: 'goods-receipt-area',
            userId: req.userId,
            departmentId: department.id
        }))
    );

    emitStockUpdated({ source: 'goods-receipt-confirm', notification: warehouseNotification });

    for (const productNotification of productStockNotifications) {
        emitStockUpdated({ source: 'product-stock-status', notification: productNotification });
    }

    return res.status(200).json({
        goodsReceipt,
        code: successCodeMessages.CONFIRMED_GOODS_RECEIPT
    });
};

export const cancelGoodsReceiptStatus = async (req, res) => {

    const goodsReceipt = await cancelGoodsReceipt({ id: req.params.id, userId: req.userId });

    return res.status(200).json({
        goodsReceipt,
        code: successCodeMessages.CANCELED_GOODS_RECEIPT
    });
};
