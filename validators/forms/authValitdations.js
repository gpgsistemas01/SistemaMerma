
import { validatePassword, validateRepeatedPassword, validateUsername } from "../fields/fieldsValidator.js";

export const loginValidation = [
    validateUsername,
    validatePassword,
]

export const authRegisterValidation = [
    validateUsername,
    validatePassword,
    validateRepeatedPassword,
];