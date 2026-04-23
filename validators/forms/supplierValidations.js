import { validateIsActive, validateText } from "../fields/fieldsValidator.js";

export const supplierValidation = [
    validateText('legalName', 200),
    validateText('tradeName', 100),
    validateIsActive
]
