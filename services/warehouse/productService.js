import { ExcededMaxRetriesSkuError, ProductCreateDatabaseError, ProductNotFound, ProductUpdateDatabaseError } from "../../errors/warehouse/productError.js";
import { prisma } from "../../lib/prisma.js";

const MAX_RETRIES = 5;

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

const normalizeWords = (name) => {
    const words = name.split(/\s+/).filter(Boolean);
    const result = [];

    for (let i = 0; i < words.length; i++) {
        const current = words[i];

        if (/^\d+$/.test(current) && words[i + 1]) {
            result.push(current + words[i + 1]);
            i++;
        } else {
            result.push(current);
        }
    }

    return result;
};

const getChunk = (word) => {
    const cleaned = word
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '');

    return cleaned.slice(0, 3);
};

const generateSku = (name) => {
    const maxLength = 9;
    return normalizeWords(name)
        .map(getChunk)
        .slice(0, maxLength)
        .join('-');
};

const ensureUniqueSku = async (baseSku) => {

    const existingSkus = await prisma.product.findMany({
        where: {
            sku: {
                startsWith: baseSku
            }
        },
        select: { sku: true }
    });

    const regex = new RegExp(`^${baseSku}(?:-(\\d+))?$`);

    let max = 0;
    let baseExists = false;

    for (const item of existingSkus) {
        const match = item.sku.match(regex);

        if (match) {
            if (match[1]) {
                const num = parseInt(match[1], 10);
                if (num > max) max = num;
            } else {
                baseExists = true;
            }
        }
    }

    if (!baseExists) return baseSku;

    return `${baseSku}-${max + 1}`;
}

const inferPresentation = (base, height) => {

    if (base && height) return (base > 10) ? 'ROLLO' : 'HOJA';

    return 'PIEZA';
}

export const createProduct = async (productDto) => {

    let uniqueSku;
    let success = false;
    let attempts = 0;

    while (attempts < MAX_RETRIES) {
        try {

            const sku = generateSku(productDto.name, productDto.base, productDto.height);

            uniqueSku = await ensureUniqueSku(sku);

            const presentation = inferPresentation(productDto.base, productDto.height);

            const product = await prisma.product.create({
                data: {
                    ...productDto,
                    sku: uniqueSku,
                    presentation
                }
            });

            return product;

        } catch (err) {

            if (err.code === 'P2002') {

                attempts++;
                continue;
            }

            throw new ProductCreateDatabaseError();
        }
    }

    throw new ExcededMaxRetriesSkuError();
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

        const sku = generateSku(productDto.name, productDto.base, productDto.height);

        uniqueSku = await ensureUniqueSku(sku);

        const presentation = inferPresentation(productDto.base, productDto.height);

        const product = await prisma.product.update({
            data: {
                ...productDto,
                sku: uniqueSku,
                presentation
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
