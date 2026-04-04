import { prisma } from "../../lib/prisma.js";

export const findAllUoms = async ({
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

    const uoms = await prisma.uoM.findMany({
        skip,
        take,
        where,
        orderBy: {
            [orderBy]: orderDir
        }
    });

    const total = await prisma.uoM.count();
    const filtered = await prisma.uoM.count({ where });

    return {
        data: uoms,
        recordsTotal: total,
        recordsFiltered: filtered
    };
};