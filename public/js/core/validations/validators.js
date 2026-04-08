import { isEmptyOrNull } from "./baseValidations.js";
import { validateName, validateNumberphone, validatePassword, validateNumber, validateUsername, validateTextOptional, validateDimension, validateDateOptional, validateDetailsArray, validateDate, validateConsumptionDetailsArray } from "./fieldValidations.js";

export const supplierValidators = {
    name: validateName,
    numberphone: validateNumberphone,
}

export const productValidators = {
    uomId: (value) => isEmptyOrNull(value, 'La unidad de medida'),
    categoryId: (value) => isEmptyOrNull(value, 'La categoría'),
    name: validateName,
    unitCost: (value) => validateNumber(value, 'El costo unitario'),
    minStock: (value) => validateNumber(value, 'El stock mínimo'),
    maxStock: (value) => validateNumber(value, 'El stock máximo'),
    expiryDate: (value) => validateDateOptional(value, 'La fecha de vencimiento'),
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

export const validateGoodsReceiptValidators = {
    receivedById: (value) => isEmptyOrNull(value, 'El recibidor'),
    supplierId: (value) => isEmptyOrNull(value, 'El proveedor'),
    observations: (value) => validateTextOptional(value, 'Las observaciones'),
    receptionDate: (value) => validateDate(value, 'La fecha de recepción'),
    details: validateDetailsArray
}

export const validateGoodsIssueValidators = {
    requesterId: (value) => isEmptyOrNull(value, 'El solicitante'),
    projectId: (value) => isEmptyOrNull(value, 'El proyecto'),
    observations: (value) => validateTextOptional(value, 'Las observaciones'),
    requestDate: (value) => validateDate(value, 'La fecha de solicitud'),
    details: validateDetailsArray
}

export const validatePurchaseRequisitionValidators = {
    projectId: (value) => isEmptyOrNull(value, 'El proyecto'),
    observations: (value) => validateTextOptional(value, 'Las observaciones'),
    requestDate: (value) => validateDate(value, 'La fecha de solicitud'),
    details: validateDetailsArray
};

export const validateProductConsumptionValidators = {
    requesterId: (value) => isEmptyOrNull(value, 'El encargado'),
    projectId: (value) => isEmptyOrNull(value, 'El proyecto'),
    machineId: (value) => isEmptyOrNull(value, 'La máquina'),
    requestDate: (value) => validateDate(value, 'La fecha de solicitud'),
    details: validateConsumptionDetailsArray
};
