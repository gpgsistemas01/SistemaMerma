import express from 'express';
import { verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { getLatestNotifications, readAllNotifications } from '../../../controllers/api/warehouse/notificationController.js';

const router = express.Router();

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    getLatestNotifications
);

router.patch(
    '/read-all',
    verifyCookiesAuthTokenRequired,
    readAllNotifications
);

export default router;
