import { validateDate, validateDetailsArray, validateTextOptional, validateUUID } from "../fields/fieldsValidator.js";

export const goodsIssueValidation = [
    validateUUID('requesterId'),
    validateUUID('projectId'),
    validateDate('requestDate'),
    validateTextOptional('observations'),
    validateDetailsArray
];
