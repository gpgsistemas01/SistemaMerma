import express from 'express';
import { authorizeUserWeb, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { getProductConsumptionsPage } from '../../../controllers/web/warehouse/productConsumptionController.js';

const router = express.Router();

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    authorizeUserWeb({
        roles: ['Coordinador', 'Administrador del sistema'],
        departments: ['Impresión', 'Sistemas']
    }),
    getProductConsumptionsPage
);

export default router;
