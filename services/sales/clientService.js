import { prisma } from "../../lib/prisma.js";

export const findAllClients = async ({
    advisorId,
    skip = 0,
    take = 10,
    search = '',
    orderBy = 'name',
    orderDir = 'asc'
}) => {

    const where = {
        ...(advisorId && { advisorId: advisorId }),
        ...(search && {
            name: {
                contains: search,
                mode: 'insensitive'
            }
        })
    };

    const clients = await prisma.client.findMany({
        skip,
        take,
        where,
        orderBy: {
            [orderBy]: orderDir
        }
    });

    const total = await prisma.client.count();
    const filtered = await prisma.client.count({ where });

    return {
        data: clients,
        recordsTotal: total,
        recordsFiltered: filtered
    };
}