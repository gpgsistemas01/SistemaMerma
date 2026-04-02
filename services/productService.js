import { ProductNotFound } from "../errors/warehouse/productError.js";
import { prisma } from "../lib/prisma.js";

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

    const total = await prisma.product.count();
    const filtered = await prisma.product.count({ where });

    return {
        data: products,
        recordsTotal: total,
        recordsFiltered: filtered
    };
};

export const createProduct = async (productDto) => {

    const product = await prisma.product.create({
        data: {
            name: productDto.name
        }
    });

    return product;
}

export const updateProduct = async (productDto, id) => {

    try {

        const product = await prisma.product.update({
            data: {
                name: productDto.name
            },
            where: {
                id: id
            }
        });

        return product;

    } catch (err) {

        if (err.code === 'P2025') throw ProductNotFound();

        throw err;
    }
}