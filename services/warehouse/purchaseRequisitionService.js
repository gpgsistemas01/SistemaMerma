import { ProjectNotFound, PurchaseRequisitionNotFound, RequesterProfileNotFound } from "../../errors/warehouse/purchaseRequisitionError.js";
import { prisma } from "../../lib/prisma.js";

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

    const canViewAll = userRole === 'Coordinador' && userDepartment === 'Almacén';

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
            department: {
                select: {
                    id: true,
                    name: true
                }
            },
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
            department: {
                select: {
                    name: true
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
        where: currentDepartment && currentDepartment !== 'Almacén'
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

        throw err;
    }
};
