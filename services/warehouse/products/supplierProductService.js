import { GoodsIssueInexistentStock, GoodsIssueInsufficientStock } from "../../../errors/inventory/stockError.js";
import { ProductSnapshotFindDatabaseError, SupplierProductCreateDatabaseError, SupplierProductDeleteDatabaseError } from "../../../errors/warehouse/productError.js";
import { prisma } from "../../../lib/prisma.js";
import { buildStockKey, parseStockKey } from "../../../utils/formattersUtils.js";

const MOVEMENT_TYPE_IN = 'IN';

const mapSupplierProduct = (sp) => {

    const { product, supplier, maxUnitCost, currentStock, convertedQuantity } = sp;

    return {
        ...product,
        maxUnitCost,
        currentStock,
        convertedQuantity,
        supplier: { ...supplier }
    };
};

export const findAllSupplierProducts = async ({
    skip= 0,
    take = 10,
    search = '',
    supplierId = null,
    orderBy = 'id',
    orderDir = 'asc'
}) => {

    const where = { AND: [] };

    if (search) where.AND.push({
        product: {
            name: {
                contains: search,
                mode: 'insensitive'
            }
        }
    });

    if (supplierId) where.AND.push({
        supplierId
    });

    if (where.AND.length === 0) delete where.AND;

    const supplierProducts = await prisma.supplierProduct.findMany({
        skip,
        take,
        where,
        select: {
            id: true,
            maxUnitCost: true,
            currentStock: true,
            convertedQuantity: true,
            product: {
                select: {
                    id: true,
                    name: true,
                    minStock: true,
                    isActive: true,
                    base: true,
                    height: true,
                    presentation: true,
                    unitMeasure: true
                }
            },

            supplier: {
                select: {
                    id: true,
                    code: true,
                    tradeName: true
                }
            }
        },
        orderBy: {
            product: {
                [orderBy]: orderDir
            }
        }
    });

    const sorted = supplierProducts.sort((a, b) => {

        const isLowStockA = Number(a.product.currentStock) < Number(a.product.minStock);
        const isLowStockB = Number(b.product.currentStock) < Number(b.product.minStock);

        if (isLowStockA !== isLowStockB) return isLowStockB - isLowStockA;

        return 0;
    });

    const total = await countTotalSupplierProducts();
    const filtered = await countTotalSupplierProducts({ where });

    return {
        data: sorted.map(mapSupplierProduct),
        recordsTotal: total,
        recordsFiltered: filtered
    };
}

export const findSupplierProductByIds = async ({
    tx,
    productId,
    supplierId
}) => {

    const db = tx || prisma;

    const supplierProduct = await db.supplierProduct.findUnique({
        where: { 
            supplierId_productId: { 
                productId, 
                supplierId 
            } 
        },
        select: {
            product: {
                select: {
                    id: true,
                    name: true,
                    currentStock: true,
                    minStock: true,
                    isActive: true,
                    base: true,
                    height: true,
                    unitCost: true,
                    convertedQuantity: true,
                    presentation: true,
                    unitMeasure: true
                }
            },
            supplier: {
                select: {
                    id: true,
                    code: true,
                    tradeName: true
                }
            }
        }
    });

    return mapSupplierProduct(supplierProduct);
};

export const findSupplierProductStocks = async ({ tx, where, select }) => {

    const db = tx || prisma;

    return await db.supplierProduct.findMany({
        where,
        select
    });
}

export const findSupplierProductsSnapshot = async ({
    tx,
    pairs
}) => {

    const db = tx || prisma;

    try {

        const products = await db.supplierProduct.findMany({
            where: {
                OR: pairs
            },
            include: {
                product: {
                    select: {
                        id: true,
                        name:true,
                        base: true,
                        height: true,
                        presentation: true,
                        unitMeasure: true
                    }
                },
                supplier: {
                    select: {
                        id: true,
                        tradeName: true
                    }
                }
            }
        });

        return products.map(mapSupplierProduct);

    } catch (err) {

        throw new ProductSnapshotFindDatabaseError();
    }
}

export const countTotalSupplierProducts = async ({
    where
} = {}) => await prisma.supplierProduct.count({ where });

export const createSupplierProduct = async ({
    tx,
    supplierId,
    productId,
    skuProduct,
    skuSupllier
}) => {

    const db = tx || prisma;

    try {

        return db.supplierProduct.create({
            data: {
                supplierId,
                productId,
                sku: `${ skuProduct }-${ skuSupllier }`
            }
        });

    } catch (err) {

        throw new SupplierProductCreateDatabaseError();
    }
}

export const updateProductUnitCostIfHigher = async ({
    tx,
    supplierId,
    details
}) => {

    const db = tx || prisma;

    const maxCostByProduct = {};

    for (const detail of details) {

        const { productId, conversionUnitCost } = detail;

        if (
            !maxCostByProduct[productId] ||
            conversionUnitCost > maxCostByProduct[productId]
        ) {
            maxCostByProduct[productId] = conversionUnitCost;
        }
    }

    const productIds = Object.keys(maxCostByProduct);

    const supplierProducts = await findSupplierProductStocks({
        tx,
        where: {
            productId: { in: productIds },
            supplierId
        },
        select: {
            productId: true,
            maxUnitCost: true
        }
    });

    await Promise.all(supplierProducts
        .filter(sp => maxCostByProduct[sp.productId] > sp.maxUnitCost)
        .map(sp => db.supplierProduct.update({
                where: { 
                    supplierId_productId: { supplierId, productId: sp.productId }
                },
                data: { maxUnitCost: maxCostByProduct[sp.productId] }
            })
        )

    );
};

export const updateSupplierProductStock = async ({
    tx,
    grouped,
    movementType
}) => {

    const db = tx || prisma;

    const keys = Array.from(grouped.keys());
    const filters = keys.map(key => parseStockKey(key));

    const supplierProducts = await findSupplierProductStocks({
        tx,
        where: {
            OR: filters
        },
        select: {
            id: true,
            productId: true,
            supplierId: true,
            currentStock: true,
            product: {
                select: {
                    base: true,
                    height: true,
                    name: true
                }
            },
            supplier: {
                select: {
                    tradeName: true
                }
            }
        }
    });

    const psMap = new Map(supplierProducts.map(ps => [buildStockKey(ps.productId, ps.supplierId), ps]));

    const operations = [];

    for (const [key, quantity] of grouped.entries()) {

        const { productId, supplierId } = parseStockKey(key);

        const ps = psMap.get(key);

        if (!ps) throw new GoodsIssueInexistentStock({
            productName: ps?.product?.name ?? 'Producto desconocido',
            height: ps?.product?.height ?? 'Desconocido',
            base: ps?.product?.base ?? 'Desconocido',
            supplierName: ps?.supplier?.name ?? 'Proveedor desconocido'
        });

        const newStock = movementType === MOVEMENT_TYPE_IN
            ? Number(ps.currentStock) + Number(quantity)
            : Number(ps.currentStock) - Number(quantity);

        if (newStock < -1e-6) throw new GoodsIssueInsufficientStock({
            productName: ps?.product?.name ?? 'Producto desconocido',
            height: ps?.product?.height ?? 'Desconocido',
            base: ps?.product?.base ?? 'Desconocido',
            supplierName: ps?.supplier?.name ?? 'Proveedor desconocido'
        });

        const hasDimensions = ps.product.base && ps.product.height;
        const convertedQuantity = hasDimensions
            ? newStock * (ps.product.base * ps.product.height)
            : newStock;

        operations.push(
            db.supplierProduct.update({
                where: { 
                    supplierId_productId: { supplierId, productId } 
                },
                data: {
                    currentStock: newStock,
                    convertedQuantity
                }
            })
        );
    }

    await Promise.all(operations);
}

export const deleteSupplierProduct = async ({
    tx,
    productId,
    supplierId
}) => {

    const db = tx || prisma;

    try {

        return await db.supplierProduct.delete({
            where: {
                supplierId_productId: {productId, supplierId }
            }
        });

    } catch (err) {

        throw new SupplierProductDeleteDatabaseError();
    }
}