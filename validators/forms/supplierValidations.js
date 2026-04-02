import { validateIsActive, validateName, validateNumberphone } from "../fields/fieldsValidator.js";

export const supplierValidation = [
    validateName,
    validateNumberphone,
    validateIsActive
]