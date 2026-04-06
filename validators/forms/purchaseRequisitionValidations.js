import { validateDate, validateDetailsArray, validateTextOptional, validateUUID } from "../fields/fieldsValidator.js";

export const purchaseRequisitionValidation = [
    validateUUID('projectId'),
    validateUUID('requesterId'),
    validateDate('requestDate'),
    validateTextOptional('observations'),
    validateDetailsArray
];
