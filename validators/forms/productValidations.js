import { validateDateOptional, validateIsActive, validateMinMaxStock, validateName, validateNumber, validateNumberOptional, validateTextOptional, validateUUID } from "../fields/fieldsValidator.js";

export const productValidation = [
    validateUUID('categoryId'),
    validateUUID('uomId'),
    validateName,
    validateNumber('unitCost'),
    validateNumber('minStock'),
    validateNumber('maxStock'),
    validateMinMaxStock,
    validateDateOptional('expiryDate'),
    validateNumberOptional('thickness'),
    validateNumberOptional('base'),
    validateNumberOptional('height'),
    validateTextOptional('color'),
    validateTextOptional('type'),
    validateTextOptional('presentation'),
    validateIsActive
]