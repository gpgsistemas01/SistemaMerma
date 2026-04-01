import express from 'express';
import { authorizeUserWeb, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { getrequisitionsReturnsPage } from '../../../controllers/web/warehouse/requisitionReturnController.js';

const router = express.Router();

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    authorizeUserWeb({
        roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'],
        departments: ['Almacén', 'Sistemas']
    }),
    getrequisitionsReturnsPage
);

export default router;