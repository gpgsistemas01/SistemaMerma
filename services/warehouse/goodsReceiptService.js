import { ProfileNotFound, GoodsReceiptNotFound, SupplierNotFound } from "../../errors/warehouse/goodsReceiptError.js";
import { prisma } from "../../lib/prisma.js";

export const findAllGoodsReceipts = async ({
    skip = 0,
    take = 10,
    search = '',
    orderBy = 'receptionDate',
    orderDir = 'asc'
}) => {

    const where = search
        ? {
            referenceNumber: {
                contains: search,
                mode: 'insensitive'
            }
        }
        : {};

    const goodsReceipts = await prisma.goodsReceipt.findMany({
        skip,
        take,
        where,
        orderBy: {
            [orderBy]: orderDir
        },
        include: {
            receivedBy: {
                select: {
                    id: true,
                    name: true,
                    lastName: true
                }
            },
            supplier: {
                select: {
                    id: true,
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
                            name: true,
                        }
                    },
                    description: true,
                    quantity: true
                }
            }
        }
    });

    const total = await prisma.goodsReceipt.count();
    const filtered = await prisma.goodsReceipt.count({ where });

    return {
        data: goodsReceipts,
        recordsTotal: total,
        recordsFiltered: filtered
    };
};

const validateGoodsReceiptRelations = async ({ receivedById, supplierId }) => {

    const [supplier, receivedBy] = await Promise.all([
        prisma.supplier.findUnique({
            where: { id: supplierId }
        }),
        prisma.profile.findUnique({
            where: { id: receivedById }
        })
    ]);

    if (!supplier) throw new SupplierNotFound();
    if (!receivedBy) throw new ProfileNotFound();
};

export const createGoodsReceipt = async (goodsReceiptDto) => {

    const { receivedById, supplierId, details, ...goodsReceiptData } = goodsReceiptDto;

    await validateGoodsReceiptRelations({ receivedById, supplierId });

    const result = await prisma.$transaction(async (tx) => {

        const user = await tx.user.findFirst({
            where: {
                profiles: {
                    some: {
                        id: receivedById
                    }
                }
            },
            select: {
                departmentId: true
            }
        });

        const type = 'REC';

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

        const goodsReceipt = await tx.goodsReceipt.create({
            data: {
                ...goodsReceiptData,
                status: {
                    connect: {
                        name: 'Abierta'
                    }
                },
                supplier: {
                    connect: {
                        id: supplierId
                    }
                },
                receivedBy: {
                    connect: {
                        id: receivedById
                    }
                },
                department: {
                    connect: {
                        id:  user.departmentId,
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

        return { goodsReceipt };
    });

    return result.goodsReceipt;
}

export const updateGoodsReceipt = async (goodsReceiptDto, id) => {

    const { receivedById, supplierId, details, ...goodsReceiptData } = goodsReceiptDto;

    await validateGoodsReceiptRelations({ receivedById, supplierId });

    try {

        const result = await prisma.$transaction(async (prisma) => {

            const goodsReceipt = await prisma.goodsReceipt.update({
                data: {
                    ...goodsReceiptData,
                    supplier: {
                        connect: {
                            id: supplierId
                        }
                    },
                    receivedBy: {
                        connect: {
                            id: receivedById
                        }
                    },
                },
                where: {
                    id: id
                }
            });

            const incomingDetailsIds = details.map(detail => detail.id).filter(Boolean);
            const deleteFilter = { goodsReceiptId: id };
            
            if (incomingDetailsIds.length) deleteFilter.id = { notIn: incomingDetailsIds };

            await prisma.detailGoodsReceiptProduct.deleteMany({
                where: deleteFilter
            });

            const detailsGoodsReceipt = await Promise.all(details.map(async detail => {

                return await prisma.detailGoodsReceiptProduct.create({
                    data: { 
                        ...detail,
                        goodsReceiptId: id
                    }
                });
            }));

            goodsReceipt.details = detailsGoodsReceipt;

            return { goodsReceipt };
        });

        return result;

    } catch (err) {

        if (err.code === 'P2025') throw GoodsReceiptNotFound();

        throw err;
    }
}