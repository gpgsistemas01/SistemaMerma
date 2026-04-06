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

const validateGoodsReceiptRelations = async (goodsReceiptDto) => {

    const [supplier, receivedBy] = await Promise.all([
        prisma.supplier.findUnique({
            where: { id: goodsReceiptDto.supplierId }
        }),
        prisma.profile.findUnique({
            where: { id: goodsReceiptDto.receivedById }
        })
    ]);

    if (!supplier) throw new SupplierNotFound();
    if (!receivedBy) throw new ProfileNotFound();
};

export const createGoodsReceipt = async (goodsReceiptDto) => {

    await validateGoodsReceiptRelations(goodsReceiptDto);

    const { receivedById, supplierId, details, ...goodsReceiptData } = goodsReceiptDto;

    const result = await prisma.$transaction(async (prisma) => {

        const user = await prisma.user.findFirst({
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

        const goodsReceipt = await prisma.goodsReceipt.create({
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

    await validateGoodsReceiptRelations(goodsReceiptDto);

    const { receivedById, supplierId, detailsGoodsReceipt, ...goodsReceiptData } = goodsReceiptDto;

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
                    }
                },
                where: {
                    id: id
                }
            });

            const incomingDetailsIds = detailsGoodsReceipt.map(detail => detail.id).filter(id => id);

            await prisma.detailGoodsReceiptProduct.deleteMany({
                where: {
                    goodsReceiptId: id,
                    id: {
                        notIn: incomingDetailsIds.length ? incomingDetailsIds : [0]
                    }
                }
            });

            const details = await Promise.all(detailsGoodsReceipt.map(async detail => {

                const { goodsReceiptId, ...detailData } = detail;

                return await prisma.detailGoodsReceiptProduct.upsert({
                    create: {
                        ...detailData,
                        goodsReceiptId: goodsReceipt.id
                    },
                    update: {
                        ...detailData
                    },
                    where: {
                        id: detail.id ?? 0
                    }
                });
            }));

            return { goodsReceipt, details };
        });

        return result;

    } catch (err) {

        if (err.code === 'P2025') throw GoodsReceiptNotFound();

        throw err;
    }
}