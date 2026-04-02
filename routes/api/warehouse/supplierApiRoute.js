import express from 'express';
import { authorizeUserWeb, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { editSupplier, getAllSuppliers, registerSupplier } from '../../../controllers/api/warehouse/supplierController.js';
import { supplierValidation } from '../../../validators/forms/supplierValidations.js';
import { validate } from '../../../middleware/validatorMiddleware.js';

const router = express.Router();

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    authorizeUserWeb({
        roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'],
        departments: ['Almacén', 'Sistemas']
    }),
    getAllSuppliers
);

router.post(
    '/',
    verifyCookiesAuthTokenRequired,
    supplierValidation,
    validate,
    authorizeUserWeb({
        roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'],
        departments: ['Almacén', 'Sistemas']
    }),
    registerSupplier
);

router.put(
    '/:id',
    verifyCookiesAuthTokenRequired,
    supplierValidation,
    validate,
    authorizeUserWeb({
        roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'],
        departments: ['Almacén', 'Sistemas']
    }),
    editSupplier
);

export default router;