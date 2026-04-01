import express from 'express';
import { authorizeUserWeb, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { editCategory, getAllCategories, registerCategory } from '../../../controllers/api/warehouse/categoryController.js';
import { categoryValidation } from '../../../validators/forms/categoryValidations.js';
import { validate } from '../../../middleware/validatorMiddleware.js';

const router = express.Router();

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    authorizeUserWeb({
        roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'],
        departments: ['Almacén', 'Sistemas']
    }),
    getAllCategories
);

router.post(
    '/',
    verifyCookiesAuthTokenRequired,
    categoryValidation,
    validate,
    authorizeUserWeb({
        roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'],
        departments: ['Almacén', 'Sistemas']
    }),
    registerCategory
);

router.put(
    '/:id',
    verifyCookiesAuthTokenRequired,
    categoryValidation,
    validate,
    authorizeUserWeb({
        roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'],
        departments: ['Almacén', 'Sistemas']
    }),
    editCategory
);

export default router;