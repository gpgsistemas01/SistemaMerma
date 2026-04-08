import {
    ProjectNotFound,
    PurchaseRequisitionNotFound,
    PurchaseRequisitionStatusUpdateDatabaseError,
    PurchaseRequisitionStatusNotFound,
    PurchaseRequisitionUpdateDatabaseError,
    RequesterProfileNotFound,
    PurchaseRequisitionApproverProfileNotFound
} from "../../errors/warehouse/purchaseRequisitionError.js";
import { prisma } from "../../lib/prisma.js";

const allowedDepartments = ['Almcén', 'Sistemas'];
const allowedUsers = ['Coordinador', 'Administrador del sistema'];

export const findAllPurchaseRequisitions = async ({
    currentDepartment = '',
    skip = 0,
    take = 10,
    search = '',
    orderBy = 'requestDate',
    orderDir = 'asc',
    userDepartment = '',
    userRole = ''
}) => {

    const canViewAll = allowedUsers.includes(userRole) && allowedDepartments.includes(userDepartment);

    const where = {
        ...(search && {
            referenceNumber: {
                contains: search,
                mode: 'insensitive'
            }
        }),
        ...(!canViewAll && userDepartment && {
            department: {
                name: userDepartment
            }
        })
    };

    const purchaseRequisitions = await prisma.purchaseRequisition.findMany({
        skip,
        take,
        where,
        orderBy: {
            [orderBy]: orderDir
        },
        include: {
            department: true,
            approver: {
                select: {
                    id: true,
                    name: true,
                    lastName: true
                }
            },
            requester: {
                select: {
                    id: true,
                    name: true,
                    lastName: true
                }
            },
            project: {
                select: {
                    id: true,
                    referenceNumber: true,
                    name: true,
                    client: true,
                    date: true
                }
            },
            deliveredBy: {
                select: {
                    id: true,
                    name: true,
                    lastName: true
                }
            },
            status: {
                select: {
                    id: true,
                    name: true
                }
            },
            details: {
                select: {
                    id: true,
                    product: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    description: true,
                    quantity: true
                }
            }
        }
    });

    const total = await prisma.purchaseRequisition.count({
        where: currentDepartment && !allowedDepartments.includes(currentDepartment)
            ? {
                department: {
                    name: currentDepartment
                }
            }
            : {}
    });
    const filtered = await prisma.purchaseRequisition.count({ where });

    return {
        data: purchaseRequisitions,
        recordsTotal: total,
        recordsFiltered: filtered
    };
};

const validatePurchaseRequisitionRelations = async ({ projectId, userId }) => {

    const [project, user] = await Promise.all([
        prisma.project.findFirst({
            where: { id: projectId }
        }),
        prisma.user.findUnique({
            where: { 
                id: userId
            },
            include: {
                profiles: true
            }
        })
    ]);

    const requester = user?.profiles[0];
    const departmentId = user?.departmentId;

    if (!project) throw new ProjectNotFound();
    if (!requester) throw new RequesterProfileNotFound();

    return { project, requester, departmentId };
};

export const createPurchaseRequisition = async ({
    purchaseRequisitionDto,
    userId
}) => {

    const { projectId, details, ...purchaseRequisitionData } = purchaseRequisitionDto;

    const { requester, departmentId } = await validatePurchaseRequisitionRelations({ projectId, userId });

    const result = await prisma.$transaction(async (tx) => {

        const type = 'REQ';

        const counter = await tx.referenceNumberCounter.update({
            where: { prefix: type },
            data: {
                counter: {
                    increment: 1
                }
            }
        });

        const year = new Date().getFullYear();
        const referenceNumber = `${type}-${year}-${counter.counter.toString().padStart(6, '0')}`;

        const purchaseRequisition = await tx.purchaseRequisition.create({
            data: {
                ...purchaseRequisitionData,
                status: {
                    connect: {
                        name: 'Abierta'
                    }
                },
                project: {
                    connect: {
                        id: projectId
                    }
                },
                requester: {
                    connect: {
                        id: requester.id
                    }
                },
                department: {
                    connect: {
                        id: departmentId
                    }
                },
                referenceNumber,
                details: {
                    create: details.map(({ productId, ...rest }) => ({
                        ...rest,
                        product: {
                            connect: {
                                id: productId
                            }
                        }
                    }))
                }
            }
        });

        return { purchaseRequisition };
    });

    return result.purchaseRequisition;
};

export const updatePurchaseRequisition = async ({
    purchaseRequisitionDto, 
    id,
    userId
}) => {

    const { projectId, details, ...purchaseRequisitionData } = purchaseRequisitionDto;

    const { requester } = await validatePurchaseRequisitionRelations({ projectId, userId });

    const purchaseRequisitionExists = await prisma.purchaseRequisition.findUnique({
        where: { id },
        select: {
            id: true
        }
    });

    if (!purchaseRequisitionExists) throw new PurchaseRequisitionNotFound();

    try {

        const result = await prisma.$transaction(async (prisma) => {

            const purchaseRequisition = await prisma.purchaseRequisition.update({
                data: {
                    ...purchaseRequisitionData,
                    project: {
                        connect: {
                            id: projectId
                        }
                    },
                    requester: {
                        connect: {
                            id: requester.id
                        }
                    }
                },
                where: { id }
            });

            const incomingDetailsIds = details.map(detail => detail.id).filter(Boolean);
            const deleteFilter = { purchaseRequisitionId: id };

            if (incomingDetailsIds.length) deleteFilter.id = { notIn: incomingDetailsIds };

            await prisma.detailPurchaseRequisitionProduct.deleteMany({
                where: deleteFilter
            });

            const detailsPurchaseRequisition = await Promise.all(details.map(async detail => {

                return await prisma.detailPurchaseRequisitionProduct.create({
                    data: {
                        ...detail,
                        purchaseRequisitionId: id
                    }
                });
            }));

            purchaseRequisition.details = detailsPurchaseRequisition;

            return { purchaseRequisition };
        });

        return result;

    } catch (err) {

        if (err.code === 'P2025') throw new PurchaseRequisitionNotFound();

        throw new PurchaseRequisitionUpdateDatabaseError();
    }
};

const updatePurchaseRequisitionStatus = async ({ id, statusName, userId }) => {

    const purchaseRequisition = await prisma.purchaseRequisition.findUnique({
        where: { id },
        include: {
            status: {
                select: {
                    name: true
                }
            }
        }
    });

    if (!purchaseRequisition) throw new PurchaseRequisitionNotFound();
    if (purchaseRequisition.status?.name !== 'Abierta') throw new PurchaseRequisitionStatusNotFound();

    try {

        const data = {
            status: {
                connect: {
                    name: statusName
                }
            }
        };

        if (statusName === 'Confirmada') {
            const approver = await prisma.profile.findFirst({
                where: {
                    isActive: true,
                    users: {
                        some: {
                            id: userId,
                            isActive: true
                        }
                    }
                },
                select: {
                    id: true
                }
            });

            if (!approver) throw new PurchaseRequisitionApproverProfileNotFound();

            data.approver = {
                connect: {
                    id: approver.id
                }
            };
            data.approveDate = new Date();
        }

        return await prisma.purchaseRequisition.update({
            where: { id },
            data,
            select: {
                id: true,
                status: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
    } catch (err) {
        if (err.code === 'P2025') throw new PurchaseRequisitionStatusNotFound();
        throw new PurchaseRequisitionStatusUpdateDatabaseError();
    }
};

export const confirmPurchaseRequisition = async ({ id, userId }) =>
    await updatePurchaseRequisitionStatus({ id, statusName: 'Confirmada', userId });

export const cancelPurchaseRequisition = async ({ id, userId }) =>
    await updatePurchaseRequisitionStatus({ id, statusName: 'Cancelada', userId });
