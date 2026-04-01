import express from 'express';
import { login, refreshAuthToken, resetPassword } from '../../controllers/api/authController.js';
import { loginValidation } from '../../validators/forms/authValitdations.js';
import { passwordValidation } from '../../validators/forms/validations.js';
import { validate, validateLogin } from '../../middleware/validatorMiddleware.js';

const router = express.Router();

router.post(
    '/login', 
    loginValidation, 
    validateLogin, 
    login
);

router.post(
    '/refresh', 
    refreshAuthToken
);

router.patch(
    '/reset', 
    passwordValidation, 
    validate, 
    resetPassword
);

export default router;