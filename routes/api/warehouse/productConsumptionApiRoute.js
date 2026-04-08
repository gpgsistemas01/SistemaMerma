import express from 'express';
import { authorizeUserApi, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { validate } from '../../../middleware/validatorMiddleware.js';
import {
    editProductConsumption,
    getAllMachinesController,
    getAllProductConsumptions,
    registerProductConsumption
} from '../../../controllers/api/warehouse/productConsumptionController.js';
import { productConsumptionValidation } from '../../../validators/forms/productConsumptionValidations.js';

const router = express.Router();

const productConsumptionPermissions = {
    roles: ['Administrador del sistema', 'Coordinador'],
    departments: ['Sistemas', 'Impresión']
};

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    authorizeUserApi(productConsumptionPermissions),
    getAllProductConsumptions
);

router.post(
    '/',
    verifyCookiesAuthTokenRequired,
    productConsumptionValidation,
    validate,
    authorizeUserApi(productConsumptionPermissions),
    registerProductConsumption
);

router.put(
    '/:id',
    verifyCookiesAuthTokenRequired,
    productConsumptionValidation,
    validate,
    authorizeUserApi(productConsumptionPermissions),
    editProductConsumption
);

router.get(
    '/machines',
    verifyCookiesAuthTokenRequired,
    authorizeUserApi(productConsumptionPermissions),
    getAllMachinesController
);

export default router;
