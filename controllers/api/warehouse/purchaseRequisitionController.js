import { createPurchaseRequisitionDtoForRegister } from "../../../dtos/purchaseRequisitionDTO.js";
import { successCodeMessages } from "../../../messages/codeMessages.js";
import {
    cancelPurchaseRequisition,
    confirmPurchaseRequisition,
    createPurchaseRequisition,
    findAllPurchaseRequisitions,
    updatePurchaseRequisition
} from "../../../services/warehouse/purchaseRequisitionService.js";
import { createStockNotification } from "../../../services/warehouse/notificationService.js";
import { sanitizeEmptyStrings } from "../../../utils/formattersUtils.js";
import { emitStockUpdated } from "../../../utils/socketUtils.js";

export const getAllPurchaseRequisitions = async (req, res) => {

    const { department = '' } = req.query;

    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const search =req.query['search[value]'] || '';

    const columns = ['referenceNumber'];
    const orderColumnIndex = req.query.order?.[0]?.column || 0;
    const orderDir = req.query.order?.[0]?.dir || 'desc';

    const result = await findAllPurchaseRequisitions({
        currentDepartment: department,
        skip: start,
        take: length,
        search,
        orderBy: columns[orderColumnIndex],
        orderDir,
        userDepartment: req.user?.department,
        userRole: req.user?.role
    });

    res.status(200).json(result);
};

export const registerPurchaseRequisition = async (req, res) => {

    const purchaseRequisitionDto = createPurchaseRequisitionDtoForRegister(req.body);
    const sanitizedPurchaseRequisitionDto = sanitizeEmptyStrings(purchaseRequisitionDto);

    const purchaseRequisition = await createPurchaseRequisition({
        purchaseRequisitionDto: sanitizedPurchaseRequisitionDto,
        userId: req.userId
    });

    return res.status(200).json({
        purchaseRequisition,
        code: successCodeMessages.CREATED_PURCHASE_REQUISITION
    });
};

export const editPurchaseRequisition = async (req, res) => {

    const purchaseRequisitionDto = createPurchaseRequisitionDtoForRegister(req.body);
    const sanitizedPurchaseRequisitionDto = sanitizeEmptyStrings(purchaseRequisitionDto);

    const purchaseRequisition = await updatePurchaseRequisition({
        purchaseRequisitionDto: sanitizedPurchaseRequisitionDto, 
        id: req.params.id, 
        userId: req.userId
    });

    return res.status(200).json({
        purchaseRequisition,
        code: successCodeMessages.UPDATED_PURCHASE_REQUISITION
    });
};

export const confirmPurchaseRequisitionStatus = async (req, res) => {

    const purchaseRequisition = await confirmPurchaseRequisition({ id: req.params.id, userId: req.userId });
    // const totalProducts = purchaseRequisition.totalRequestedProducts || 0;
    // const notification = await createStockNotification({
    //     title: 'Requisición aprobada',
    //     message: `Requisición folio ${purchaseRequisition.referenceNumber} aprobada con ${totalProducts} producto(s).`,
    //     type: 'info',
    //     referenceNumber: purchaseRequisition.referenceNumber,
    //     entityId: purchaseRequisition.id,
    //     entityType: 'purchase-requisition',
    //     userId: req.userId,
    //     departmentId: purchaseRequisition.department?.id || null
    // });

    // emitStockUpdated({ source: 'purchase-requisition-confirm', notification });

    return res.status(200).json({
        purchaseRequisition,
        code: successCodeMessages.CONFIRMED_PURCHASE_REQUISITION
    });
};

export const cancelPurchaseRequisitionStatus = async (req, res) => {

    const purchaseRequisition = await cancelPurchaseRequisition({ id: req.params.id, userId: req.userId });

    return res.status(200).json({
        purchaseRequisition,
        code: successCodeMessages.CANCELED_PURCHASE_REQUISITION
    });
};
