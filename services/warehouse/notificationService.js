import { prisma } from "../../lib/prisma.js";

const ROLE_SYSTEM_ADMIN = 'Administrador del sistema';
const DEPARTMENT_WAREHOUSE = 'Almacén';
const ENTITY_PRODUCT_LOW_STOCK = 'product-low-stock';
const ENTITY_PRODUCT_STOCK_RESTORED = 'product-stock-restored';
const ENTITY_GOODS_RECEIPT_AREA = 'goods-receipt-area';

const getNotificationWhereByUser = async (userId) => {

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            role: {
                select: {
                    name: true
                }
            },
            department: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });

    if (!user) return {};

    const canViewAllNotifications = user.role?.name === ROLE_SYSTEM_ADMIN || user.department?.name === DEPARTMENT_WAREHOUSE;

    if (canViewAllNotifications) {
        return {
            entityType: {
                notIn: [ENTITY_GOODS_RECEIPT_AREA, ENTITY_PRODUCT_STOCK_RESTORED]
            }
        };
    }

    return {
        AND: [
            {
                entityType: {
                    not: ENTITY_PRODUCT_STOCK_RESTORED
                }
            },
            {
                OR: [
                    {
                        departmentId: user.department?.id
                    },
                    {
                        entityType: ENTITY_PRODUCT_LOW_STOCK
                    }
                ]
            }
        ]
    };
};

export const createStockNotification = async ({ 
    title, 
    message, 
    type = 'warning', 
    referenceNumber = null,
    entityId = null,
    entityType = null,
    userId = null,
    departmentId = null
}) => {

    return prisma.notification.create({
        data: {
            title,
            message,
            type,
            entityId,
            referenceNumber,
            entityType,
            userId,
            departmentId
        }
    });
};

export const createNotifications = async (notifications = []) => {

    if (!notifications.length) return [];

    await prisma.notification.createMany({
        data: notifications
    });

    return notifications;
};

export const findDepartmentsForStockBroadcast = async () => {

    return prisma.department.findMany({
        where: {
            name: {
                not: DEPARTMENT_WAREHOUSE
            }
        },
        select: {
            id: true
        }
    });
};

export const notifyProductStockStatusChanges = async ({ productIds = [], userId = null }) => {

    if (!productIds.length) return [];

    const uniqueProductIds = [...new Set(productIds)];
    const products = await prisma.product.findMany({
        where: {
            id: {
                in: uniqueProductIds
            }
        },
        select: {
            id: true,
            name: true,
            currentStock: true,
            minStock: true
        }
    });

    const notificationsToCreate = [];

    for (const product of products) {
        const latestStateNotification = await prisma.notification.findFirst({
            where: {
                entityId: product.id,
                entityType: {
                    in: [ENTITY_PRODUCT_LOW_STOCK, ENTITY_PRODUCT_STOCK_RESTORED]
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                entityType: true
            }
        });

        const currentStock = Number(product.currentStock);
        const minStock = Number(product.minStock);
        const isLowStock = currentStock < minStock;
        const lastNotificationType = latestStateNotification?.entityType || null;

        if (isLowStock && lastNotificationType !== ENTITY_PRODUCT_LOW_STOCK) {
            notificationsToCreate.push({
                title: 'Stock mínimo',
                message: `El producto ${product.name} se encuentra en stock mínimo.`,
                type: 'warning',
                entityId: product.id,
                entityType: ENTITY_PRODUCT_LOW_STOCK,
                referenceNumber: null,
                userId,
                departmentId: null
            });
        }

        if (!isLowStock && lastNotificationType === ENTITY_PRODUCT_LOW_STOCK) {
            notificationsToCreate.push({
                title: 'Stock restaurado',
                message: `El producto ${product.name} restauró su nivel de stock.`,
                type: 'info',
                entityId: product.id,
                entityType: ENTITY_PRODUCT_STOCK_RESTORED,
                referenceNumber: null,
                userId,
                departmentId: null
            });
        }
    }

    if (!notificationsToCreate.length) return [];

    await createNotifications(notificationsToCreate);

    return prisma.notification.findMany({
        where: {
            entityId: {
                in: notificationsToCreate.map((notification) => notification.entityId)
            },
            entityType: {
                in: [ENTITY_PRODUCT_LOW_STOCK, ENTITY_PRODUCT_STOCK_RESTORED]
            }
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: notificationsToCreate.length
    });
};

export const findLatestNotifications = async ({ take = 10, userId } = {}) => {

    const where = await getNotificationWhereByUser(userId);

    const [items, unreadCount] = await Promise.all([
        prisma.notification.findMany({
            where,
            take,
            orderBy: {
                createdAt: 'desc'
            }
        }),
        prisma.notification.count({
            where: {
                ...where,
                isRead: false
            }
        })
    ]);

    return {
        items,
        unreadCount
    };
};

export const markAllNotificationsAsRead = async ({ userId }) => {

    const where = await getNotificationWhereByUser(userId);

    await prisma.notification.updateMany({
        where: {
            ...where,
            isRead: false
        },
        data: {
            isRead: true
        }
    });
};
