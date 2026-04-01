import { isEmptyOrNull, isString } from "./validations.js"

export const validateQuery = (value) => {

    const fieldname = 'El texto de búsqueda';
    let result = isEmptyOrNull(value, fieldname);

    if (result) return result;

    result = isString(value, fieldname);

    return result;
}