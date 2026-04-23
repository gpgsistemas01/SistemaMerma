import { validateIsActive, validateName, validateNumberOptional, validateUUID } from "../fields/fieldsValidator.js";

export const productValidation = [
    validateName(200),
    validateUUID('supplierId'),
    validateUUID('presentationId'),
    validateUUID('unitMeasureId'),
    validateNumberOptional('minStock', { disableTooLong: true }),
    validateNumberOptional('base'),
    validateNumberOptional('height'),
    validateIsActive
]
