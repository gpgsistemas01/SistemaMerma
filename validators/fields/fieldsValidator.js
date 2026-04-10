import { body } from "express-validator";
import { errorMap } from "../../messages/codeMessages.js";

const numberRegex = /\d/;
const UppercaseRegex = /[A-Z]/;
const whitespaceRegex = /^\S+$/;
const usernameRegex = /^[a-zA-Z0-9_]+$/;
const passwordRegex = /^[A-Za-z0-9!@#\$%\^&\*]+$/;
const nameRegex = /^[\p{L}0-9]+(?:[ '\-.,:;()¿?¡!][\p{L}0-9]+)*[.,:;()¿?¡!]*$/u;

export const validateUsername = 
    body('name')
        .trim()
        .notEmpty().withMessage(errorMap['username'].REQUIRED)
        .isString().withMessage(errorMap['username'].INVALID_TYPE)
        .isLength({ max: 50 }).withMessage(errorMap['username'].TOO_LONG)
        .matches(whitespaceRegex).withMessage(errorMap['username'].NO_SPACES)
        .matches(usernameRegex).withMessage(errorMap['username'].INVALID_FORMAT)
;

export const validatePassword = 
    body('password')
        .notEmpty().withMessage(errorMap['password'].REQUIRED)
        .isString().withMessage(errorMap['password'].INVALID_TYPE)
        .isLength({ min: 6 }).withMessage(errorMap['password'].TOO_SHORT)
        .isLength({ max: 50 }).withMessage(errorMap['password'].TOO_LONG)
        .matches(UppercaseRegex).withMessage(errorMap['password'].NEEDS_UPPERCASE)
        .matches(numberRegex).withMessage(errorMap['password'].NEEDS_NUMBER)
        .matches(passwordRegex).withMessage(errorMap['password'].INVALID_FORMAT)
;

export const validateName = 
    body('name')
        .trim()
        .notEmpty().withMessage(errorMap['name'].REQUIRED)
        .isString().withMessage(errorMap['name'].INVALID_TYPE)
        .isLength({ max: 50 }).withMessage(errorMap['name'].TOO_LONG)
        .matches(nameRegex).withMessage(errorMap['name'].INVALID_FORMAT)
;

export const validateNumberphone =
        body('numberphone')
            .trim()
            .if(body('numberphone').notEmpty())
            .isMobilePhone('es-MX').withMessage(errorMap['numberphone'].INVALID_FORMAT)
            .isLength({ max: 20 }).withMessage(errorMap['numberphone'].TOO_LONG)
;

export const validateIsActive = 
    body('isActive')
        .notEmpty().withMessage(errorMap['isActive'].REQUIRED)
        .isBoolean().withMessage(errorMap['isActive'].INVALID_BOOLEAN)
        .toBoolean()
;

export const validateUUID = (fieldName) => {

    const errors = errorMap[fieldName];

    return body(fieldName)
        .notEmpty().withMessage(errors.REQUIRED)
        .isUUID('4').withMessage(errors.INVALID_UUID)
}

export const validateNumber = (fieldName) => {

    const errors = errorMap[fieldName];

    return body(fieldName)
        .notEmpty().withMessage(errors.REQUIRED)
        .isFloat().withMessage(errors.INVALID_NUMBER)
        .matches(/^\d{1,8}(\.\d{1,2})?$/).withMessage(errors.TOO_LONG)
        .toFloat()
}

export const validateNumberOptional = (fieldName) => {

    const errors = errorMap[fieldName];

    return body(fieldName)
        .if(body(fieldName).notEmpty())
        .notEmpty().withMessage(errors.REQUIRED)
        .isFloat().withMessage(errors.INVALID_NUMBER)
        .matches(/^\d{1,7}(\.\d{1,3})?$/).withMessage(errors.TOO_LONG)
        .toFloat()
}

export const validateTextOptional = (fieldName) => {

    const errors = errorMap[fieldName];

    return body(fieldName)
        .trim()
        .if(body(fieldName).notEmpty())
        .isString().withMessage(errors.INVALID_TYPE)
        .isLength({ max: 50 }).withMessage(errors.TOO_LONG)
}

export const validateMinMaxStock = 
    body('minStock')
        .custom((value, { req }) => {

            const errors = errorMap['minStock'];
            const maxStock = parseFloat(req.body.maxStock);
            const minStock = parseFloat(value);

            if (minStock > maxStock) throw new Error(errors.MIN_GREATER_THAN_MAX);

            return true;
        })
;

export const validateDate = (fieldName) => {

    const errors = errorMap[fieldName];

    return body(fieldName)
        .notEmpty().withMessage(errors.REQUIRED)
        .isISO8601().withMessage(errors.INVALID_FORMAT)
        .custom(value => !isNaN(new Date(value))).withMessage(errors.INVALID_FORMAT)
        .toDate()
}

export const validateDateOptional = (fieldName) => {

    const errors = errorMap[fieldName];

    return body(fieldName)
        .if(body(fieldName).notEmpty())
        .isISO8601().withMessage(errors.INVALID_FORMAT)
        .custom(value => !isNaN(new Date(value))).withMessage(errors.INVALID_FORMAT)
        .toDate()
}

export const validateDetailsArray = 
    body('details')
        .isArray({ min: 1 }).withMessage(errorMap['details'].REQUIRED)
        .custom(details => {

            details.forEach(detail => {

                if (!detail.productId || !detail.quantity) throw new Error(errorMap['details'].INVALID_FORMAT_REQUIRED);

                const qty = Number(detail.quantity);

                if (!Number.isFinite(qty) || qty < 1) throw new Error(errorMap['details'].INVALID_FORMAT_QUANTITY);
            });

            return true;
        })
;