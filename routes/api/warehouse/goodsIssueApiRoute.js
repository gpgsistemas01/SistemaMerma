import express from 'express';
import { authorizeUserApi, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { validate } from '../../../middleware/validatorMiddleware.js';
import {
    approveGoodsIssueStatus,
    cancelGoodsIssueStatus,
    confirmGoodsIssueStatus,
    editGoodsIssue,
    getAllGoodsIssues,
    registerGoodsIssue,
    rejectGoodsIssueStatus
} from '../../../controllers/api/warehouse/goodsIssueController.js';
import { goodsIssueValidation } from '../../../validators/forms/goodsIssueValidations.js';

const router = express.Router();

const goodsIssuePermissions = {
    roles: ['Administrador del sistema', 'Coordinador', 'Auxiliar', 'Operador', 'Instalador', 'Almacenista'],
    departments: ['Sistemas', 'Impresión', 'Router', 'Taller 3d', 'Herrería', 'Acabados', 'PT', 'Tráfico', 'Instalaciones', 'Almacén']
};

const goodsIssueApprovalPermissions = {
    roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'],
    departments: ['Sistemas', 'Impresión', 'Router', 'Taller 3d', 'Herrería', 'Acabados', 'PT', 'Tráfico', 'Instalaciones', 'Almacén']
};

const goodsIssueConfirmationPermissions = {
    roles: ['Coordinador', 'Auxiliar', 'Almacenista', 'Administrador del sistema'],
    departments: ['Sistemas', 'Almacén']
};

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    authorizeUserApi(goodsIssuePermissions),
    getAllGoodsIssues
);

router.post(
    '/',
    verifyCookiesAuthTokenRequired,
    goodsIssueValidation,
    validate,
    authorizeUserApi(goodsIssuePermissions),
    registerGoodsIssue
);

router.put(
    '/:id',
    verifyCookiesAuthTokenRequired,
    goodsIssueValidation,
    validate,
    authorizeUserApi(goodsIssuePermissions),
    editGoodsIssue
);

router.patch(
    '/:id/approve',
    verifyCookiesAuthTokenRequired,
    authorizeUserApi(goodsIssueApprovalPermissions),
    approveGoodsIssueStatus
);

router.patch(
    '/:id/reject',
    verifyCookiesAuthTokenRequired,
    authorizeUserApi(goodsIssueApprovalPermissions),
    rejectGoodsIssueStatus
);

router.patch(
    '/:id/confirm',
    verifyCookiesAuthTokenRequired,
    authorizeUserApi(goodsIssueConfirmationPermissions),
    confirmGoodsIssueStatus
);

router.patch(
    '/:id/cancel',
    verifyCookiesAuthTokenRequired,
    authorizeUserApi(goodsIssueConfirmationPermissions),
    cancelGoodsIssueStatus
);

export default router;
