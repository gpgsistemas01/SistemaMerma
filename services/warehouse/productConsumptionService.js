import {
    ProductConsumptionGoodsIssueNotFound,
    ProductConsumptionMachineNotFound,
    ProductConsumptionNotFound,
    ProductConsumptionProjectNotFound,
    ProductConsumptionRequesterProfileNotFound,
    ProductConsumptionUpdateDatabaseError
} from "../../errors/warehouse/productConsumptionError.js";
import { prisma } from "../../lib/prisma.js";

export const findAllProductConsumptions = async ({ skip = 0, take = 10, search = '', orderBy = 'requestDate', orderDir = 'asc' }) => {
    const where = {
        ...(search && {
            referenceNumber: {
                contains: search,
                mode: 'insensitive'
            }
        })
    };

    const productConsumptions = await prisma.productConsumption.findMany({
        skip,
        take,
        where,
        orderBy: { [orderBy]: orderDir },
        include: {
            requester: { select: { id: true, name: true, lastName: true } },
            project: { select: { id: true, referenceNumber: true, name: true } },
            machine: { select: { id: true, name: true } },
            details: {
                select: {
                    id: true,
                    consumedSquareMeters: true,
                    product: { select: { id: true, name: true } },
                    goodsIssue: { select: { id: true, referenceNumber: true } }
                }
            }
        }
    });

    const total = await prisma.productConsumption.count();
    const filtered = await prisma.productConsumption.count({ where });

    return { data: productConsumptions, recordsTotal: total, recordsFiltered: filtered };
};

const validateProductConsumptionRelations = async ({ projectId, requesterId, machineId, details }) => {
    const [project, requester, machine, goodsIssues] = await Promise.all([
        prisma.project.findUnique({ where: { id: projectId } }),
        prisma.profile.findUnique({ where: { id: requesterId } }),
        prisma.machine.findUnique({ where: { id: machineId } }),
        prisma.goodsIssue.findMany({ where: { id: { in: details.map(detail => detail.goodsIssueId) } }, select: { id: true } })
    ]);

    if (!project) throw new ProductConsumptionProjectNotFound();
    if (!requester) throw new ProductConsumptionRequesterProfileNotFound();
    if (!machine) throw new ProductConsumptionMachineNotFound();

    const goodsIssueIds = new Set(goodsIssues.map(goodsIssue => goodsIssue.id));
    if (details.some(detail => !goodsIssueIds.has(detail.goodsIssueId))) throw new ProductConsumptionGoodsIssueNotFound();
};

export const createProductConsumption = async (productConsumptionDto) => {
    const { requesterId, projectId, machineId, details, ...data } = productConsumptionDto;

    await validateProductConsumptionRelations({ projectId, requesterId, machineId, details });

    const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.findFirst({
            where: { profiles: { some: { id: requesterId } } },
            select: { departmentId: true }
        });

        if (!user) throw new ProductConsumptionRequesterProfileNotFound();

        const type = 'CON';
        const counter = await tx.referenceNumberCounter.update({
            where: { prefix: type },
            data: { counter: { increment: 1 } }
        });

        const year = new Date().getFullYear();
        const referenceNumber = `${ type }-${ year }-${ counter.counter.toString().padStart(6, '0') }`;

        return await tx.productConsumption.create({
            data: {
                ...data,
                referenceNumber,
                status: { connect: { name: 'Abierta' } },
                department: { connect: { id: user.departmentId } },
                project: { connect: { id: projectId } },
                requester: { connect: { id: requesterId } },
                machine: { connect: { id: machineId } },
                details: {
                    create: details.map(({ productId, goodsIssueId, consumedSquareMeters }) => ({
                        consumedSquareMeters,
                        product: { connect: { id: productId } },
                        goodsIssue: { connect: { id: goodsIssueId } }
                    }))
                }
            }
        });
    });

    return result;
};

export const updateProductConsumption = async ({ productConsumptionDto, id }) => {
    const { requesterId, projectId, machineId, details, ...data } = productConsumptionDto;

    await validateProductConsumptionRelations({ projectId, requesterId, machineId, details });

    const exists = await prisma.productConsumption.findUnique({ where: { id }, select: { id: true } });
    if (!exists) throw new ProductConsumptionNotFound();

    try {
        return await prisma.$transaction(async (tx) => {
            const productConsumption = await tx.productConsumption.update({
                where: { id },
                data: {
                    ...data,
                    project: { connect: { id: projectId } },
                    requester: { connect: { id: requesterId } },
                    machine: { connect: { id: machineId } }
                }
            });

            const incomingIds = details.map(detail => detail.id).filter(Boolean);
            const deleteFilter = { productConsumptionId: id };
            if (incomingIds.length) deleteFilter.id = { notIn: incomingIds };

            await tx.detailProductConsumption.deleteMany({ where: deleteFilter });

            const consumptionDetails = await Promise.all(details.map(detail => tx.detailProductConsumption.create({
                data: {
                    productConsumptionId: id,
                    productId: detail.productId,
                    goodsIssueId: detail.goodsIssueId,
                    consumedSquareMeters: detail.consumedSquareMeters
                }
            })));

            productConsumption.details = consumptionDetails;
            return productConsumption;
        });
    } catch (err) {
        if (err.code === 'P2025') throw new ProductConsumptionNotFound();
        throw new ProductConsumptionUpdateDatabaseError();
    }
};

export const findAllMachines = async () => prisma.machine.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
});
