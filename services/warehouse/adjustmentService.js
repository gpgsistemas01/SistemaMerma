import { AdjustmentStatus, InventoryMovementType, StockAdjustmentType } from "../../generated/prisma/enums.js";
import { getDb } from "../../repository/baseRepository.js";
import { createStockAdjustmentMovement } from "../inventory/movementService.js";
import { adjustSupplierProductStock, findSupplierProductByIds } from "./products/supplierProductService.js";

export const createStockAdjustment = async ({
    productId,
    supplierId,
    reasonId,
    observations,
    newStock,
    userId
}) => {

    return await getDb().$transaction(async (tx) => {

        const product = await findSupplierProductByIds({
            tx,
            productId,
            supplierId
        });

        const previousStock = Number(product.currentStock);

        const difference = newStock - previousStock;

        const adjustmentType = difference >= 0
            ? StockAdjustmentType.INCREASE
            : StockAdjustmentType.DECREASE;

        const previousConvertedQuantity = Number(product.convertedQuantity);

        const conversionFactor =
            (Number(product.base || 1) * Number(product.height || 1));

        const newConvertedQuantity =
            newStock * conversionFactor;

        const convertedDifference =
            newConvertedQuantity - previousConvertedQuantity;

        const adjustment = await tx.stockAdjustment.create({
            data: {
                referenceNumber: crypto.randomUUID(),
                type: adjustmentType,
                reasonId,
                observations,
                status: AdjustmentStatus.APPLIED,
                createdById: userId,
                approvedById: userId,
                appliedAt: new Date(),

                details: {
                    create: {
                        productId,
                        supplierId,

                        previousStock,
                        newStock,
                        difference,

                        previousConvertedQuantity,
                        newConvertedQuantity,
                        convertedDifference,

                        productBase: product.base,
                        productHeight: product.height
                    }
                }
            },
            include: {
                details: true
            }
        });

        await createStockAdjustmentMovement({
            tx,
            productId,
            supplierId,
            reasonId,
            previousStock,
            previousConvertedQuantity,
            newStock,
            newConvertedQuantity,
            difference
        });

        const updatedProduct = await adjustSupplierProductStock({
            tx,
            productId,
            supplierId,
            newStock,
            newConvertedQuantity
        });

        return updatedProduct;
    });
};