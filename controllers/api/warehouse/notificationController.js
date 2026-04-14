import { findLatestNotifications, markAllNotificationsAsRead } from "../../../services/warehouse/notificationService.js";

export const getLatestNotifications = async (req, res) => {

    const result = await findLatestNotifications({ take: 15, department: req.user?.department, role: req.user?.role });

    return res.status(200).json(result);
};

export const readAllNotifications = async (req, res) => {

    await markAllNotificationsAsRead({ userId: req.userId, department: req.user?.department, role: req.user?.role });

    return res.status(200).json({
        message: 'Notificaciones marcadas como leídas.'
    });
};
