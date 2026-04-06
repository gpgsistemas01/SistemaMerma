import express from 'express';
import { authorizeUserWeb, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { validate } from '../../../middleware/validatorMiddleware.js';
import { editPurchaseRequisition, getAllPurchaseRequisitions, registerPurchaseRequisition } from '../../../controllers/api/warehouse/purchaseRequisitionController.js';
import { purchaseRequisitionValidation } from '../../../validators/forms/purchaseRequisitionValidations.js';

const router = express.Router();

const purchaseRequisitionPermissions = {
    roles: ['Administrador del sistema', 'Coordinador', 'Auxiliar', 'Operador', 'Instalador', 'Almacenista'],
    departments: ['Sistemas', 'Impresión', 'Router', 'Taller 3d', 'Herrería', 'Acabados', 'PT', 'Tráfico', 'Instalaciones', 'Almacén']
};

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    authorizeUserWeb(purchaseRequisitionPermissions),
    getAllPurchaseRequisitions
);

router.post(
    '/',
    verifyCookiesAuthTokenRequired,
    purchaseRequisitionValidation,
    validate,
    authorizeUserWeb(purchaseRequisitionPermissions),
    registerPurchaseRequisition
);

router.put(
    '/:id',
    verifyCookiesAuthTokenRequired,
    purchaseRequisitionValidation,
    validate,
    authorizeUserWeb(purchaseRequisitionPermissions),
    editPurchaseRequisition
);

export default router;
