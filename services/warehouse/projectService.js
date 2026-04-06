import { prisma } from "../../lib/prisma.js";

export const findAllProjects = async ({
    skip = 0,
    take = 10,
    search = '',
    orderBy = 'name',
    orderDir = 'asc'
}) => {

    const where = search
        ? {
            OR: [
                {
                    name: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    referenceNumber: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ]
        }
        : {};

    const projects = await prisma.project.findMany({
        skip,
        take,
        where,
        orderBy: {
            [orderBy]: orderDir
        }
    });

    const total = await prisma.project.count();
    const filtered = await prisma.project.count({ where });

    return {
        data: projects,
        recordsTotal: total,
        recordsFiltered: filtered
    };
};
