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

const validatePurchaseRequisitionRelations = async (purchaseRequisitionDto) => {

    const [project, requester] = await Promise.all([
        prisma.project.findUnique({
            where: { id: purchaseRequisitionDto.projectId }
        }),
        prisma.profile.findUnique({
            where: { id: purchaseRequisitionDto.requesterId }
        })
    ]);

    if (!project) throw new ProjectNotFound();
    if (!requester) throw new RequesterProfileNotFound();
};

export const createPurchaseRequisition = async (purchaseRequisitionDto) => {

    await validatePurchaseRequisitionRelations(purchaseRequisitionDto);

    const { requesterId, projectId, details, ...purchaseRequisitionData } = purchaseRequisitionDto;

    const result = await prisma.$transaction(async (prisma) => {

        const user = await prisma.user.findFirst({
            where: {
                profiles: {
                    some: {
                        id: requesterId
                    }
                }
            },
            select: {
                departmentId: true
            }
        });

        if (!user) throw new RequesterProfileNotFound();

        const type = 'REQ';

        const counter = await prisma.referenceNumberCounter.update({
            where: { prefix: type },
            data: {
                counter: {
                    increment: 1
                }
            }
        });

        const year = new Date().getFullYear();
        const referenceNumber = `${type}-${year}-${counter.counter.toString().padStart(6, '0')}`;

        const purchaseRequisition = await prisma.purchaseRequisition.create({
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
                        id: requesterId
                    }
                },
                department: {
                    connect: {
                        id: user.departmentId
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

export const updatePurchaseRequisition = async (purchaseRequisitionDto, id) => {

    await validatePurchaseRequisitionRelations(purchaseRequisitionDto);

    const { requesterId, projectId, details, ...purchaseRequisitionData } = purchaseRequisitionDto;

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
                            id: requesterId
                        }
                    }
                },
                where: {
                    id
                }
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
