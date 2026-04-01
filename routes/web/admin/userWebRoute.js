import express from 'express';
import { authorizeUserWeb, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { getUser } from '../../../controllers/web/admin/userController.js';

const router = express.Router();

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    authorizeUserWeb({
        roles: ['Administrador del sistema'],
        departments: ['Sistemas']
    }),
    getUser
);

export default router;