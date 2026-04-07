import express from 'express';
import { getAllProfiles } from "../../../controllers/api/admin/profileController.js";
import { authorizeUserApi, verifyCookiesAuthTokenRequired } from "../../../middleware/authMiddleware.js";

const router = express.Router();
const profilePermissions = {
    roles: [
        'Administrador del sistema',
        'Coordinador',
        'Auxiliar',
        'Operador',
        'Instalador',
        'Diseñador',
        'Almacenista',
        'Vendedor',
        'Repartidor',
    ],
    departments: [
        'Sistemas',
        'Ventas',
        'Diseño',
        'Impresión',
        'Router',
        'Taller 3d',
        'Herrería',
        'Acabados',
        'PT',
        'Tráfico',
        'Instalaciones',
        'Almacén',
    ]
};

router.get(
    '/',
    verifyCookiesAuthTokenRequired,
    authorizeUserApi(profilePermissions),
    getAllProfiles
);

export default router;
