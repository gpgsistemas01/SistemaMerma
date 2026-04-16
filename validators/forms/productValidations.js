import { validateIsActive, validateName, validateNumberOptional } from "../fields/fieldsValidator.js";

export const productValidation = [
    validateName(200),
    validateNumberOptional('unitCost'),
    validateNumberOptional('minStock'),
    validateNumberOptional('base'),
    validateNumberOptional('height'),
    validateIsActive
]