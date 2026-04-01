import express from 'express';
import { getProductsPage } from '../../../controllers/web/warehouse/productController.js';
import { authorizeUserWeb, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';

const router = express.Router();

router.get(
    '/', 
    verifyCookiesAuthTokenRequired,
    authorizeUserWeb({
        roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'],
        departments: ['Almacén', 'Sistemas']
    }),
    getProductsPage
);

export default router;