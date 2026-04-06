import express from 'express';
import { verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { getAllProjects } from '../../../controllers/api/admin/projectController.js';

const router = express.Router();

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    getAllProjects
);

export default router;
