import express from 'express';
import { authorizeUserWeb, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { getAllProjects } from '../../../controllers/api/warehouse/projectController.js';

const router = express.Router();

const projectPermissions = {
    roles: ['Administrador del sistema', 'Coordinador', 'Auxiliar', 'Operador', 'Instalador', 'Almacenista'],
    departments: ['Sistemas', 'Impresión', 'Router', 'Taller 3d', 'Herrería', 'Acabados', 'PT', 'Tráfico', 'Instalaciones', 'Almacén']
};

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    authorizeUserWeb(projectPermissions),
    getAllProjects
);

export default router;
