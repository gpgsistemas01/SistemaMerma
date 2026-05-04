import { prisma } from "../../lib/prisma.js";
import { updateProductCurrentStock } from "../warehouse/products/productService.js";

const REFERENCE_TYPE_GOODS_RECEIPT = 'GOODS_RECEIPT';
const REFERENCE_TYPE_GOODS_ISSUE = 'GOODS_ISSUE';
const REFERENCE_TYPE_PURCHASE_REQUISITION = 'PURCHASE_REQUISITION';

export const applyInventoryMovement = async ({
    tx,
    reference = {},
    details,
    movementType
}) => {

    const db = tx || prisma;

    const data = {
        date: new Date(),
        ...reference,
        details: {
            create: details.map(detail => ({
                productId: detail.productId,
                quantity: detail.quantity,
                ...(detail.goodsReceiptDetailId && { goodsReceiptDetailId: detail.goodsReceiptDetailId }),
                ...(detail.goodsIssueDetailId && { goodsIssueDetailId: detail.goodsIssueDetailId })
            }))
        }
    };

    const movement = await db.inventoryMovement.create({
        data,
        include: {
            details: {
                select: {
                    productId: true,
                    quantity: true
                }
            }
        }
    });

    const grouped = new Map();

    for (const detail of movement.details) {
        grouped.set(
            detail.productId,
            Number((grouped.get(detail.productId) || 0)) + Number(detail.quantity)
        );
    }

    await updateProductCurrentStock({
        tx,
        grouped,
        movementType
    });

    return movement.details.map(d => d.productId);
};