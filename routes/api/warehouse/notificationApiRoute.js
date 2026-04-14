import express from 'express';
import { authorizeUserApi, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { getLatestNotifications, readAllNotifications } from '../../../controllers/api/warehouse/notificationController.js';

const router = express.Router();

const notificationPermissions = {
    roles: ['Administrador del sistema', 'Coordinador', 'Auxiliar', 'Operador', 'Instalador', 'Almacenista'],
    departments: ['Sistemas', 'Ventas', 'Diseño', 'Impresión', 'Router', 'Taller 3d', 'Herrería', 'Acabados', 'PT', 'Tráfico', 'Instalaciones', 'Almacén']
};

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    authorizeUserApi(notificationPermissions),
    getLatestNotifications
);

router.patch(
    '/read-all',
    verifyCookiesAuthTokenRequired,
    authorizeUserApi(notificationPermissions),
    readAllNotifications
);

export default router;
