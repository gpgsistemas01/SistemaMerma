import { prisma } from "../../lib/prisma.js";

export const findSupplierProduct = async ({ tx, where, select }) => {

    const db = tx || prisma;
    
    return await db.supplierProduct.findMany({
        where,
        select
    });
}