import express from 'express';
import { authorizeUserApi, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { getAllProjects } from '../../../controllers/api/admin/projectController.js';

const router = express.Router();
const projectPermissions = {
    roles: ['Administrador del sistema'],
    departments: ['Sistemas']
};

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    authorizeUserApi(projectPermissions),
    getAllProjects
);

export default router;
