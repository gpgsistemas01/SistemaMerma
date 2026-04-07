import express from 'express';
import { authorizeUserApi, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { validate } from '../../../middleware/validatorMiddleware.js';
import {
    cancelPurchaseRequisitionStatus,
    confirmPurchaseRequisitionStatus,
    editPurchaseRequisition,
    getAllPurchaseRequisitions,
    registerPurchaseRequisition
} from '../../../controllers/api/warehouse/purchaseRequisitionController.js';
import { purchaseRequisitionValidation } from '../../../validators/forms/purchaseRequisitionValidations.js';

const router = express.Router();

const purchaseRequisitionPermissions = {
    roles: ['Administrador del sistema', 'Coordinador', 'Auxiliar', 'Operador', 'Instalador', 'Almacenista'],
    departments: ['Sistemas', 'Impresión', 'Router', 'Taller 3d', 'Herrería', 'Acabados', 'PT', 'Tráfico', 'Instalaciones', 'Almacén']
};

const purchaseRequisitionWarehousePermissions = {
    roles: ['Administrador del sistema', 'Coordinador', 'Auxiliar', 'Operador', 'Instalador', 'Almacenista'],
    departments: ['Almacén', 'Sistemas']
};

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    authorizeUserApi(purchaseRequisitionPermissions),
    getAllPurchaseRequisitions
);

router.post(
    '/',
    verifyCookiesAuthTokenRequired,
    purchaseRequisitionValidation,
    validate,
    authorizeUserApi(purchaseRequisitionPermissions),
    registerPurchaseRequisition
);

router.put(
    '/:id',
    verifyCookiesAuthTokenRequired,
    purchaseRequisitionValidation,
    validate,
    authorizeUserApi(purchaseRequisitionPermissions),
    editPurchaseRequisition
);

router.patch(
    '/:id/confirm',
    verifyCookiesAuthTokenRequired,
    authorizeUserApi(purchaseRequisitionWarehousePermissions),
    confirmPurchaseRequisitionStatus
);

router.patch(
    '/:id/cancel',
    verifyCookiesAuthTokenRequired,
    authorizeUserApi(purchaseRequisitionWarehousePermissions),
    cancelPurchaseRequisitionStatus
);

export default router;
