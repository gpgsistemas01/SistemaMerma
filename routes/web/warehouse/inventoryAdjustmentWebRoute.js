import express from 'express';
import { authorizeUserWeb, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { getInventoryAdjustmentsPage } from '../../../controllers/web/warehouse/inventoryAdjustmentController.js';

const router = express.Router();

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    authorizeUserWeb({
        roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'],
        departments: ['Almacén', 'Sistemas']
    }),
    getInventoryAdjustmentsPage
);

export default router;