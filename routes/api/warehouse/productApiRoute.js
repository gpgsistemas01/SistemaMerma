import express from 'express';
import { authorizeUserWeb, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { editProduct, getAllProducts, registerProduct } from '../../../controllers/api/warehouse/productController.js';
import { productValidation } from '../../../validators/forms/productValidations.js';
import { validate } from '../../../middleware/validatorMiddleware.js';

const router = express.Router();

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    getAllProducts
);

router.post(
    '/',
    verifyCookiesAuthTokenRequired,
    productValidation,
    validate,
    authorizeUserWeb({
        roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'],
        departments: ['Almacén', 'Sistemas']
    }),
    registerProduct
);

router.put(
    '/:id',
    verifyCookiesAuthTokenRequired,
    productValidation,
    validate,
    authorizeUserWeb({
        roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'],
        departments: ['Almacén', 'Sistemas']
    }),
    editProduct
);

export default router;