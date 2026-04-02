import { body } from "express-validator";
import { errorCodeMessages } from "../../messages/codeMessages.js";

const numberRegex = /\d/;
const UppercaseRegex = /[A-Z]/;
const whitespaceRegex = /^\S+$/;
const usernameRegex = /^[a-zA-Z0-9_]+$/;
const passwordRegex = /^[A-Za-z0-9!@#\$%\^&\*]+$/;
const nameRegex = /^[\p{L}0-9]+(?:[ '\-.,:;()¿?¡!][\p{L}0-9]+)*[.,:;()¿?¡!]*$/u;

export const validatePassword = 
    body('password')
        .notEmpty().withMessage(errorCodeMessages.EMPTY_PASSWORD)
        .isString().withMessage(errorCodeMessages.PASSWORD_NOT_STRING)
        .isLength({ min: 6 }).withMessage(errorCodeMessages.PASSWORD_TOO_SHORT)
        .isLength({ max: 100 }).withMessage(errorCodeMessages.PASSWORD_TOO_LONG)
        .matches(UppercaseRegex).withMessage(errorCodeMessages.PASSWORD_NEEDS_UPPERCASE)
        .matches(numberRegex).withMessage(errorCodeMessages.PASSWORD_NEEDS_NUMBER)
        .matches(passwordRegex).withMessage(errorCodeMessages.INVALID_PASSWORD_FORMAT)
;

export const validateRepeatedPassword = 
    body('repeatedPassword')
        .notEmpty().withMessage(errorCodeMessages.EMPTY_PASSWORD)
        .isString().withMessage(errorCodeMessages.PASSWORD_NOT_STRING)
        .custom((value, { req }) => {
            if (value === req.body.password) return true;
            throw new Error(errorCodeMessages.PASSWORDS_DO_NOT_MATCH);
        })
;

export const validateName = 
    body('name')
        .trim()
        .notEmpty().withMessage(errorCodeMessages.EMPTY_NAME)
        .isString().withMessage(errorCodeMessages.NAME_NOT_STRING)
        .isLength({ min: 2 }).withMessage(errorCodeMessages.NAME_TOO_SHORT)
        .isLength({ max: 50 }).withMessage(errorCodeMessages.NAME_TOO_LONG)
        .matches(nameRegex).withMessage(errorCodeMessages.INVALID_NAME_CHARS)
;

export const validateLastName = 
    body('lastName')
        .trim()
        .notEmpty().withMessage(errorCodeMessages.EMPTY_LAST_NAME)
        .isString().withMessage(errorCodeMessages.LAST_NAME_NOT_STRING)
        .isLength({ min: 2 }).withMessage(errorCodeMessages.LAST_NAME_TOO_SHORT)
        .isLength({ max: 50 }).withMessage(errorCodeMessages.LAST_NAME_TOO_LONG)
        .matches(nameRegex).withMessage(errorCodeMessages.INVALID_LAST_NAME_CHARS)
;

export const validateUsername = 
    body('name')
        .trim()
        .notEmpty().withMessage(errorCodeMessages.EMPTY_USERNAME)
        .isString().withMessage(errorCodeMessages.USERNAME_NOT_STRING)
        .isLength({ min: 6 }).withMessage(errorCodeMessages.USERNAME_TOO_SHORT)
        .isLength({ max: 100 }).withMessage(errorCodeMessages.USERNAME_TOO_LONG)
        .matches(whitespaceRegex).withMessage(errorCodeMessages.USERNAME_INCLUDE_SPACE)
        .matches(usernameRegex).withMessage(errorCodeMessages.INVALID_USERNAME_CHARS)
;

export const validateGenericText = 
    body('q')
        .trim()
        .notEmpty().withMessage(errorCodeMessages.EMPTY_TEXT)
        .isString().withMessage(errorCodeMessages.TEXT_NOT_STRING)
        .isLength({ min: 1 }).withMessage(errorCodeMessages.TEXT_TOO_SHORT)
        .isLength({ max: 500 }).withMessage(errorCodeMessages.TEXT_TOO_LONG)
;

export const validateNumberphone =
        body('numberphone')
            .trim()
            .if(body('numberphone').exists())
            .isMobilePhone('es-MX').withMessage(errorCodeMessages.INVALID_NUMBERPHONE)
;

export const validateIsActive = 
    body('isActive')
        .notEmpty().withMessage(errorCodeMessages.EMPTY_ACTIVE)
        .isBoolean().withMessage(errorCodeMessages.INVALID_ACTIVE)