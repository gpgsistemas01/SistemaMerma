import { validateNumber, validateTextOptional, validateUUID } from '../fields/fieldsValidator.js';

const wasteDataValidation = [
    validateUUID('supplierProductId'),
    validateNumber('quantity'),
    validateNumber('base'),
    validateNumber('height')
];

export const wasteValidation = [
    ...wasteDataValidation,
    validateTextOptional({ fieldName: 'observations', maxLength: 500 }),
    validateUUID('reasonId')
];

export const wasteUpdateValidation = wasteDataValidation;
