import { validateGenericText,validatePassword, validateRepeatedPassword } from "../fields/fieldsValidator.js";

export const genericTextValidation = [
    validateGenericText,
]

export const passwordValidation = [
    validatePassword,
    validateRepeatedPassword,
];