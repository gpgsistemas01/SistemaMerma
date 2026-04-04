import { prisma } from "../../lib/prisma.js";

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