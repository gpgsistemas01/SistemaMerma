import express from 'express';
import { verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { getAllCategories } from '../../../controllers/api/warehouse/categoryController.js';

const router = express.Router();

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    getAllCategories
);

export default router;