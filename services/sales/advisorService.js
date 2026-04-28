import { prisma } from "../../lib/prisma.js";

export const findAllAdvisors = async ({
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

    const advisors = await prisma.advisor.findMany({
        skip,
        take,
        where,
        orderBy: {
            [orderBy]: orderDir
        }
    });

    const total = await prisma.advisor.count();
    const filtered = await prisma.advisor.count({ where });

    return {
        data: advisors,
        recordsTotal: total,
        recordsFiltered: filtered
    };
}