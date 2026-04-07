import express from 'express';
import { authorizeUserApi, verifyCookiesAuthTokenRequired } from '../../../middleware/authMiddleware.js';
import { getAllCategories } from '../../../controllers/api/warehouse/categoryController.js';

const router = express.Router();
const categoryPermissions = {
    roles: ['Administrador del sistema', 'Coordinador', 'Auxiliar', 'Operador', 'Instalador', 'Almacenista'],
    departments: ['Sistemas', 'Impresión', 'Router', 'Taller 3d', 'Herrería', 'Acabados', 'PT', 'Tráfico', 'Instalaciones', 'Almacén']
};

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    authorizeUserApi(categoryPermissions),
    getAllCategories
);

export default router;
