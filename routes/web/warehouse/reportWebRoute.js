import express from 'express';
import { authorizeUserWeb, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { getReport } from '../../../controllers/web/warehouse/reportController.js';

const router = express.Router();

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    authorizeUserWeb({
        roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'],
        departments: ['Almacén', 'Sistemas']
    }),
    getReport
);

export default router;