import { GoodsIssueInsufficientStock } from '../../errors/inventory/stockError.js';
import { WasteAlreadyExists } from '../../errors/warehouse/wasteError.js';
import { getDb } from '../../repository/baseRepository.js';
import { normalizeDecimal, toNumber } from '../../utils/formattersUtils.js';
import { createStockAdjustment } from './adjustmentService.js';
import { findSupplierProductById } from './products/supplierProductService.js';


const getConvertedQuantity = ({ quantity, base, height }) => normalizeDecimal(
    Number(toNumber(quantity) || 0) * Number(toNumber(base) || 0) * Number(toNumber(height) || 0)
);

const WASTE_INCLUDE = {
    supplierProduct: {
        select: {
            id: true,
            maxUnitCost: true,
            product: {
                select: {
                    name: true,
                    isActive: true,
                    presentation: true,
                    unitMeasure: true
                }
            },
            supplier: {
                select: {
                    tradeName: true
                }
            }
        }
    }
};

const mapWaste = (waste) => {

    const { supplierProduct } = waste;
    const { product, supplier } = supplierProduct || {};

    return {
        id: waste.id,
        supplierProductId: waste.supplierProductId,
        name: product?.name,
        isActive: waste.isActive,
        base: waste.base,
        height: waste.height,
        minStock: waste.minStock,
        currentStock: waste.currentStock,
        convertedQuantity: waste.convertedQuantity,
        maxUnitCost: supplierProduct?.maxUnitCost ?? null,
        product,
        supplier
    };
};


const findExistingWaste = async ({ tx, wasteDto }) => {

    const db = getDb(tx);

    return db.waste.findUnique({
        where: {
            supplierProductId_base_height: {
                supplierProductId: wasteDto.supplierProductId,
                base: wasteDto.base,
                height: wasteDto.height
            }
        },
        select: { id: true }
    });
};

const buildWasteData = ({ wasteDto }) => ({
    supplierProductId: wasteDto.supplierProductId,
    base: wasteDto.base,
    height: wasteDto.height,
    currentStock: wasteDto.quantity,
    convertedQuantity: getConvertedQuantity({
        quantity: wasteDto.quantity,
        base: wasteDto.base,
        height: wasteDto.height
    })
});

const validateProductStockForWaste = ({ product, wasteDto }) => {

    const previousStock = Number(toNumber(product.currentStock) || 0);
    const newStock = normalizeDecimal(previousStock - wasteDto.quantity);

    if (newStock < 0) {
        throw new GoodsIssueInsufficientStock({
            productName: product.name,
            height: product.height,
            base: product.base,
            supplierName: product.supplier?.tradeName
        });
    }

    return newStock;
};

export const findAllWastes = async ({
    skip = 0,
    take = 10,
    search = '',
    supplierId = null,
    orderBy = 'name',
    orderDir = 'asc'
}) => {

    const where = { AND: [] };

    if (search) where.AND.push({
        OR: [
            {
                supplierProduct: {
                    product: {
                        name: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                }
            },
            {
                supplierProduct: {
                    supplier: {
                        tradeName: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                }
            }
        ]
    });

    if (supplierId) where.AND.push({
        supplierProduct: {
            supplierId
        }
    });

    if (where.AND.length === 0) delete where.AND;

    const orderMap = {
        name: { supplierProduct: { product: { name: orderDir } } },
        supplier: { supplierProduct: { supplier: { tradeName: orderDir } } }
    };

    const db = getDb();

    const wastes = await db.waste.findMany({
        skip,
        take,
        where,
        include: WASTE_INCLUDE,
        orderBy: orderMap[orderBy] || orderMap.name
    });
    const total = await db.waste.count();
    const filtered = await db.waste.count({ where });

    return {
        data: wastes.map(mapWaste),
        recordsTotal: total,
        recordsFiltered: filtered
    };
};

export const createWasteAdjustment = async ({
    wasteDto,
    userId
}) => {

    return getDb().$transaction(async (tx) => {

        const existingWaste = await findExistingWaste({
            tx,
            wasteDto
        });

        if (existingWaste) throw new WasteAlreadyExists();

        const product = await findSupplierProductById({
            tx,
            id: wasteDto.supplierProductId
        });
        const newStock = validateProductStockForWaste({ product, wasteDto });

        await createStockAdjustment({
            tx,
            ...wasteDto,
            productId: product.id,
            supplierId: product.supplier?.id,
            newStock,
            userId
        });

        const waste = await tx.waste.create({
            data: buildWasteData({ wasteDto }),
            include: WASTE_INCLUDE
        });

        return mapWaste(waste);
    });
};

export const updateWaste = async ({
    id,
    wasteDto
}) => {

    return getDb().$transaction(async (tx) => {

        await findSupplierProductById({
            tx,
            id: wasteDto.supplierProductId
        });

        const updatedWaste = await tx.waste.update({
            where: { id },
            data: buildWasteData({ wasteDto }),
            include: WASTE_INCLUDE
        });

        return mapWaste(updatedWaste);
    });
};
