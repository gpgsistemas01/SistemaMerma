import { prisma } from "../../lib/prisma.js";

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

export const findLatestNotifications = async ({ take = 10 } = {}) => {

    const [items, unreadCount] = await Promise.all([
        prisma.notification.findMany({
            take,
            orderBy: {
                createdAt: 'desc'
            }
        }),
        prisma.notification.count({
            where: {
                isRead: false
            }
        })
    ]);

    return {
        items,
        unreadCount
    };
};

export const markAllNotificationsAsRead = async () => {

    await prisma.notification.updateMany({
        where: {
            isRead: false
        },
        data: {
            isRead: true
        }
    });
};
