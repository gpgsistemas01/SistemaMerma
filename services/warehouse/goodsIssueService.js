import {
    GoodsIssueNotFound,
    GoodsIssueProjectNotFound,
    GoodsIssueRequesterProfileNotFound,
    GoodsIssueUpdateDatabaseError
} from "../../errors/warehouse/goodsIssueError.js";
import { prisma } from "../../lib/prisma.js";

export const findAllGoodsIssues = async ({
    skip = 0,
    take = 10,
    search = '',
    orderBy = 'requestDate',
    orderDir = 'asc',
    userDepartment = '',
    userRole = ''
}) => {

    const isAdmin = userRole === 'Administrador del sistema';
    const isWarehouseCoordinator = userRole === 'Coordinador' && userDepartment === 'Almacén';

    const canViewAll = isAdmin || isWarehouseCoordinator;

    const where = {
        ...(search && {
            referenceNumber: {
                contains: search,
                mode: 'insensitive'
            }
        }),
        ...(!canViewAll && {
            OR: [
                {
                    department: {
                        name: userDepartment
                    }
                }
            ]
        })
    };

    const goodsIssues = await prisma.goodsIssue.findMany({
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
            requester: {
                select: {
                    id: true,
                    name: true,
                    lastName: true
                }
            },
            approver: {
                select: {
                    id: true,
                    name: true,
                    lastName: true
                }
            },
            warehouseStaff: {
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
                    name: true
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

    const total = await prisma.goodsIssue.count();
    const filtered = await prisma.goodsIssue.count({ where });

    return {
        data: goodsIssues,
        recordsTotal: total,
        recordsFiltered: filtered
    };
};

const validateGoodsIssueRelations = async ({ projectId, requesterId }) => {

    const [project, requester] = await Promise.all([
        prisma.project.findUnique({ where: { id: projectId } }),
        prisma.profile.findUnique({ where: { id: requesterId } })
    ]);

    if (!project) throw new GoodsIssueProjectNotFound();
    if (!requester) throw new GoodsIssueRequesterProfileNotFound();
};

export const createGoodsIssue = async (goodsIssueDto) => {

    const { requesterId, projectId, details, ...goodsIssueData } = goodsIssueDto;

    await validateGoodsIssueRelations({ projectId, requesterId });

    const result = await prisma.$transaction(async (tx) => {

        const user = await tx.user.findFirst({
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

        if (!user) throw new GoodsIssueRequesterProfileNotFound();

        const type = 'SAL';

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

        const goodsIssue = await tx.goodsIssue.create({
            data: {
                ...goodsIssueData,
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

        return { goodsIssue };
    });

    return result.goodsIssue;
};

export const updateGoodsIssue = async ({
    goodsIssueDto, 
    id,
    canEditDepartment
}) => {

    const { requesterId, projectId, details, ...goodsIssueData } = goodsIssueDto;

    await validateGoodsIssueRelations({ projectId, requesterId });

    const goodsIssueExists = await prisma.goodsIssue.findUnique({
        where: { id },
        select: {
            id: true
        }
    });

    if (!goodsIssueExists) throw new GoodsIssueNotFound();

    try {

        const result = await prisma.$transaction(async (tx) => {

            const user = await tx.user.findFirst({
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

            if (!user) throw new GoodsIssueRequesterProfileNotFound();

            const updatedData = {
                ...goodsIssueData,
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
            };

            if (canEditDepartment) {
                updatedData.department = {
                    connect: {
                        id: user.departmentId
                    }
                };
            }

            const goodsIssue = await tx.goodsIssue.update({
                data: updatedData,
                where: { id }
            });

            const incomingDetailsIds = details.map(detail => detail.id).filter(Boolean);
            const deleteFilter = { goodsIssueId: id };

            if (incomingDetailsIds.length) deleteFilter.id = { notIn: incomingDetailsIds };

            await tx.detailGoodsIssueProduct.deleteMany({
                where: deleteFilter
            });

            const detailsGoodsIssue = await Promise.all(details.map(async detail => {

                return await tx.detailGoodsIssueProduct.create({
                    data: {
                        ...detail,
                        goodsIssueId: id
                    }
                });
            }));

            goodsIssue.details = detailsGoodsIssue;

            return { goodsIssue };
        });

        return result.goodsIssue;
    } catch (err) {

        if (err.code === 'P2025') throw new GoodsIssueNotFound();

        throw new GoodsIssueUpdateDatabaseError();
    }
};
