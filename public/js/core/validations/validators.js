import { validateExpiryDate, validateName, validateNumberphone, validatePassword, validateNumber, validateUsername, validateTextOptional, validateDimension } from "./fieldValidations.js";

export const supplierValidators = {
    name: validateName,
    numberphone: validateNumberphone,
}

export const productValidators = {
    name: validateName,
    unitCost: (value) => validateNumber(value, 'El costo unitario'),
    minStock: (value) => validateNumber(value, 'El stock mínimo'),
    maxStock: (value) => validateNumber(value, 'El stock máximo'),
    expiryDate: validateExpiryDate,
    thickness: (value) => validateDimension(value, 'El espesor'),
    base: (value) => validateDimension(value, 'La base'),
    height: (value) => validateDimension(value, 'La altura'),
    color: (value) => validateTextOptional(value, 'El color'),
    type: (value) => validateTextOptional(value, 'El tipo'),
    presentation: (value) => validateTextOptional(value, 'La presentación'),
}

export const loginValidators = {
    name: validateUsername,
    password: validatePassword,
}