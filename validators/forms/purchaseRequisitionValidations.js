import { validateDate, validateDetailsArray, validateTextOptional, validateUUID } from "../fields/fieldsValidator.js";

export const purchaseRequisitionValidation = [
    validateDate('requestDate'),
    validateTextOptional('observations'),
    validateDetailsArray
];
