import { validationResult } from 'express-validator';
import { errorCodeMessages } from '../messages/codeMessages.js';

export const validate = (req, res, next) => {

    const errorsArray = validationResult(req).array();

    if (errorsArray.length > 0) {

        const errors = {};
        
        errorsArray.forEach(error => {
            errors[error.path] = error.msg;
        });

        return res.status(400).json({ errors, code: errorCodeMessages.VALIDATION_ERROR });
    }

    next();
}

export const validateLogin = (req, res, next) => {

    const errorsArray = validationResult(req).array();

    if (errorsArray.length > 0) return res.status(401).json({ code: errorCodeMessages.LOGIN_ERROR });

    next();
}