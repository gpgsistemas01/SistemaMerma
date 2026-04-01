import { CategoryNotFound } from "../errors/warehouse/categoryError.js";
import { prisma } from "../lib/prisma.js";

export const findAllCategories = async ({
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

    const categories = await prisma.category.findMany({
        skip,
        take,
        where,
        orderBy: {
            [orderBy]: orderDir
        }
    });

    const total = await prisma.category.count();
    const filtered = await prisma.category.count({ where });

    return {
        data: categories,
        recordsTotal: total,
        recordsFiltered: filtered
    };
};

export const createCategory = async (categoryDto) => {

    const category = await prisma.category.create({
        data: {
            name: categoryDto.name
        }
    });

    return category;
}

export const updateCategory = async (categoryDto, id) => {

    try {

        const category = await prisma.category.update({
            data: {
                name: categoryDto.name
            },
            where: {
                id: id
            }
        });

        return category;

    } catch (err) {

        if (err.code === 'P2025') throw CategoryNotFound();

        throw err;
    }
}