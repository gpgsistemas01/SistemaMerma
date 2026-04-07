import { CategoryNotFound, ProductNotFound, ProductUpdateDatabaseError, UomNotFound } from "../../errors/warehouse/productError.js";
import { prisma } from "../../lib/prisma.js";

export const findAllProducts = async ({
    skip = 0,
    take = 10,
    search = '',
    orderBy = 'name',
    orderDir = 'asc'
}) => {

    const where = search
        ? {
            name: {
                contains: search,
                mode: 'insensitive'
            }
        }
        : {};

    const products = await prisma.product.findMany({
        skip,
        take,
        where,
        orderBy: {
            [orderBy]: orderDir
        },
        include: {
            category: true,
            uom: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });

    const total = await prisma.product.count();
    const filtered = await prisma.product.count({ where });

    return {
        data: products,
        recordsTotal: total,
        recordsFiltered: filtered
    };
};

const validateProductRelations = async (productDto) => {

    const [category, uom] = await Promise.all([
        prisma.category.findUnique({
            where: { id: productDto.categoryId }
        }),
        prisma.uoM.findUnique({
            where: { id: productDto.uomId }
        })
    ]);

    if (!category) throw new CategoryNotFound();
    if (!uom) throw new UomNotFound();
};

export const createProduct = async (productDto) => {

    await validateProductRelations(productDto);

    const { uomId, categoryId, ...productData } = productDto;

    const product = await prisma.product.create({
        data: {
            ...productData,
            currentStock: 0,
            category: {
                connect: {
                    id: categoryId
                }
            },
            uom: {
                connect: {
                    id: uomId
                }
            }
        }
    });

    return product;
}

export const updateProduct = async (productDto, id) => {

    await validateProductRelations(productDto);

    const productExists = await prisma.product.findUnique({
        where: {
            id
        },
        select: {
            id: true
        }
    });

    if (!productExists) throw new ProductNotFound();

    const { uomId, categoryId, ...productData } = productDto;

    try {

        const product = await prisma.product.update({
            data: {
                ...productData,
                category: {
                    connect: {
                        id: categoryId
                    }
                },
                uom: {
                    connect: {
                        id: uomId
                    }
                }
            },
            where: {
                id: id
            }
        });

        return product;

    } catch (err) {

        if (err.code === 'P2025') throw new ProductNotFound();

        throw new ProductUpdateDatabaseError();
    }
}
