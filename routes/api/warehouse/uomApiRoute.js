import express from 'express';
import { verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { getAllUoms } from '../../../controllers/api/warehouse/uomController.js';

const router = express.Router();

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    getAllUoms
);

export default router;