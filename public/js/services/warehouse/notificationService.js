import { apiRequest } from "../axiosInstanceApi.js";

export const getLatestNotificationsRequest = async () =>
    apiRequest({
        method: 'get',
        url: '/api/warehouse/notifications'
    });

export const markAllNotificationsAsReadRequest = async () =>
    apiRequest({
        method: 'patch',
        url: '/api/warehouse/notifications/read-all'
    });
