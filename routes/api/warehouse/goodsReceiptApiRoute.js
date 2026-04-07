import express from 'express';
import { authorizeUserApi, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { validate } from '../../../middleware/validatorMiddleware.js';
import {
    cancelGoodsReceiptStatus,
    confirmGoodsReceiptStatus,
    editGoodsReceipt,
    getAllGoodsReceipts,
    registerGoodsReceipt
} from '../../../controllers/api/warehouse/goodsReceiptController.js';
import { goodsReceiptValidation } from '../../../validators/forms/goodsReceiptValidations.js';

const router = express.Router();
const goodsReceiptPermissions = {
    roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'],
    departments: ['Almacén', 'Sistemas']
};

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    authorizeUserApi(goodsReceiptPermissions),
    getAllGoodsReceipts
);

router.post(
    '/',
    verifyCookiesAuthTokenRequired,
    goodsReceiptValidation,
    validate,
    authorizeUserApi(goodsReceiptPermissions),
    registerGoodsReceipt
);

router.put(
    '/:id',
    verifyCookiesAuthTokenRequired,
    goodsReceiptValidation,
    validate,
    authorizeUserApi(goodsReceiptPermissions),
    editGoodsReceipt
);

router.patch(
    '/:id/confirm',
    verifyCookiesAuthTokenRequired,
    authorizeUserApi(goodsReceiptPermissions),
    confirmGoodsReceiptStatus
);

router.patch(
    '/:id/cancel',
    verifyCookiesAuthTokenRequired,
    authorizeUserApi(goodsReceiptPermissions),
    cancelGoodsReceiptStatus
);

export default router;
