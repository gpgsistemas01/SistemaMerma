import { AdjustmentStatus, InventoryMovementType, StockAdjustmentType } from "../../generated/prisma/enums.js";
import { getDb } from "../../repository/baseRepository.js";
import { findSupplierProductByIds } from "./products/supplierProductService.js";

export const applyStockAdjustment = async ({
    productId,
    supplierId,
    reasonId,
    observations,
    newStock,
    userId
}) => {

    try {

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

            const movement = await tx.inventoryMovement.create({
                data: {
                    type: InventoryMovementType.ADJUSTMENT,
                    connect: {
                        stockAdjustment: {
                            id: adjustment.id
                        }
                    },

                    details: {
                        create: {
                            productId,
                            quantity: newStock,
                            convertedQuantity: newConvertedQuantity,
                            previosuStock,
                            previousConvertedQuantity,
                            connect: {
                                supplier: {
                                    id: supplierId
                                }
                            },
                            connect: {
                                reason: {
                                    id: reasonId
                                }
                            },
                            connect: {
                                stockAdjustmentDetail: {
                                    id: adjustment.details[0].id
                                }
                            }
                        }
                    }
                }
            });

            // Actualizar producto
            const updatedProduct = await tx.product.update({
                where: { id: productId },
                data: {
                    currentStock: newStock,
                    convertedQuantity: newConvertedQuantity
                }
            });

            // Relacionar movement
            await tx.stockAdjustment.update({
                where: { id: adjustment.id },
                data: {
                    movement: {
                        connect: {
                            id: movement.id
                        }
                    }
                }
            });

            return updatedProduct;
        });

    } catch (err) {

        if (err instanceof AppError) throw err;

        throw new ProductUpdateDatabaseError();
    }
};