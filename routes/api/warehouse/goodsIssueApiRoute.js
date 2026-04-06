import express from 'express';
import { authorizeUserWeb, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { validate } from '../../../middleware/validatorMiddleware.js';
import { editGoodsIssue, getAllGoodsIssues, registerGoodsIssue } from '../../../controllers/api/warehouse/goodsIssueController.js';
import { goodsIssueValidation } from '../../../validators/forms/goodsIssueValidations.js';

const router = express.Router();

const goodsIssuePermissions = {
    roles: ['Administrador del sistema', 'Coordinador', 'Auxiliar', 'Operador', 'Instalador', 'Almacenista'],
    departments: ['Sistemas', 'Impresión', 'Router', 'Taller 3d', 'Herrería', 'Acabados', 'PT', 'Tráfico', 'Instalaciones', 'Almacén']
};

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    authorizeUserWeb(goodsIssuePermissions),
    getAllGoodsIssues
);

router.post(
    '/',
    verifyCookiesAuthTokenRequired,
    goodsIssueValidation,
    validate,
    authorizeUserWeb(goodsIssuePermissions),
    registerGoodsIssue
);

router.put(
    '/:id',
    verifyCookiesAuthTokenRequired,
    goodsIssueValidation,
    validate,
    authorizeUserWeb(goodsIssuePermissions),
    editGoodsIssue
);

export default router;
