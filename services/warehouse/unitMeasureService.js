import { prisma } from "../../lib/prisma.js";

export const findAllUnitMeasures = async ({
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

    const units = await prisma.unitMeasure.findMany({
        skip,
        take,
        where,
        orderBy: {
            [orderBy]: orderDir
        }
    });

    const total = await prisma.unitMeasure.count();
    const filtered = await prisma.unitMeasure.count({ where });

    return {
        data: units,
        recordsTotal: total,
        recordsFiltered: filtered
    };
}