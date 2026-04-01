import express from 'express';
import { getSuppliesPage } from '../../../controllers/web/warehouse/supplyController.js';
import { authorizeUserWeb, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';

const router = express.Router();

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    authorizeUserWeb({
        roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'],
        departments: ['Almacén', 'Sistemas']
    }),
    getSuppliesPage
);

export default router;