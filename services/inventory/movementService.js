import { Prisma, prisma, ReferenceType, ReferenceDetailType } from "../../lib/prisma";

const REFERENCE_MOVEMENT_IN = 'IN';
const REFERENCE_TYPE_GOODS_RECEIPT = 'GOODS_RECEIPT';
const REFERENCE_TYPE_GOODS_ISSUE = 'GOODS_ISSUE';
const REFERENCE_TYPE_PURCHASE_REQUISITION = 'PURCHASE_REQUISITION';

export const applyInventoryMovement = async ({ 
    tx, 
    referenceId, 
    referenceType,
    details, 
    movementType 
}) => {

    const db = tx || prisma;

    let reference = null;
    let referenceDetailType = null;

    if (referenceType === 'GOODS_RECEIPT') {

        reference = ReferenceType.GOODS_RECEIPT;
        referenceDetailType = ReferenceDetailType.GOODS_RECEIPT_DETAIL;
    }

    const movement = await db.inventoryMovement.create({
        data: {
            referenceId,
            referenceType: reference,
            date: new Date(),
            movementType,
            details: {
                create: details.map(detail => ({
                    referenceDetailId: detail.id,
                    referenceDetailType,
                    productId: detail.productId,
                    quantity: detail.quantity
                }))
            }
        },
        include: {
            details: {
                select: {
                    productId: true,
                    quantity: true
                }
            }
        }
    });

    const grouped = [];

    for (const detail of movement.details) {
        grouped[detail.productId] = (grouped[detail.productId] || 0) + detail.quantity;
    }

    Object.entries(grouped).forEach(([productId, quantity]) => {
        db.product.update({
            where: { id: productId },
            data: {
                currentStock: {
                    [movementType === REFERENCE_MOVEMENT_IN ? 'increment' : 'decrement']: quantity
                }
            }
        });
    });

    return movement.details.map((detail) => detail.productId);
}