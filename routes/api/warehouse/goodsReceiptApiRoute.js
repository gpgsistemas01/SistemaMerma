import express from 'express';
import { authorizeUserWeb, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { validate } from '../../../middleware/validatorMiddleware.js';
import { editGoodsReceipt, getAllGoodsReceipts, registerGoodsReceipt } from '../../../controllers/api/warehouse/goodsReceiptController.js';
import { goodsReceiptValidation } from '../../../validators/forms/goodsReceiptValidations.js';

const router = express.Router();

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    getAllGoodsReceipts
);

router.post(
    '/',
    verifyCookiesAuthTokenRequired,
    goodsReceiptValidation,
    validate,
    authorizeUserWeb({
        roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'],
        departments: ['Almacén', 'Sistemas']
    }),
    registerGoodsReceipt
);

router.put(
    '/:id',
    verifyCookiesAuthTokenRequired,
    goodsReceiptValidation,
    validate,
    authorizeUserWeb({
        roles: ['Almacenista', 'Coordinador', 'Auxiliar', 'Administrador del sistema'],
        departments: ['Almacén', 'Sistemas']
    }),
    editGoodsReceipt
);

export default router;