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
        }
    });

    const sortedProducts = products.sort((productA, productB) => {

        const isLowStockA = Number(productA.currentStock) < Number(productA.minStock);
        const isLowStockB = Number(productB.currentStock) < Number(productB.minStock);

        if (isLowStockA !== isLowStockB) return isLowStockB - isLowStockA;

        return 0;
    });

    const total = await prisma.product.count();
    const filtered = await prisma.product.count({ where });

    return {
        data: sortedProducts,
        recordsTotal: total,
        recordsFiltered: filtered
    };
};

const generateSku = (name, base, height) => {
    const cleanName = name
        .toUpperCase()
        .replace(/[^A-Z0-9 ]/g, '')
        .split(' ')
        .slice(0, 3)
        .join('-');

    const size = base && height
        ? `${base}X${height}`
        : '';

    return `${cleanName}${size ? '-' + size : ''}`;
}

const ensureUniqueSku = async (sku) => {

    let finalSku = sku;
    let count = 1;

    while (await prisma.product.findUnique({ where: { sku: finalSku }, select: { id: true } })) {

        finalSku = `${sku}-${count}`;
        count++;
    }

    return finalSku;
}

const inferPresentation = (base, height) => {

    if (base && height) return (base > 10) ? 'ROLLO' : 'HOJA';

    return 'PIEZA';
}

const buildProduct = (productDto) => {

    const sku = generateSku(productDto.name, productDto.base, productDto.height);
    
    const presentation = inferPresentation(productDto.base, productDto.height);

    return {
        ...productDto,
        sku,
        presentation
    };
}

export const createProduct = async (productDto) => {

    const product = await prisma.product.create({
        data: buildProduct(productDto)
    });

    return product;
}

export const updateProduct = async (productDto, id) => {

    const productExists = await prisma.product.findUnique({
        where: {
            id
        },
        select: {
            id: true
        }
    });

    if (!productExists) throw new ProductNotFound();

    try {

        const product = await prisma.product.update({
            data: buildProduct(productDto),
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
