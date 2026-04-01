import { isEmptyOrNull, isLengthInRangeMax, isLengthInRangeMin, isString } from "./validations.js";

export const validateText = (name, fieldName) => {

    const allowedName = /^[\p{L}0-9]+(?:[ '\-.,:;()¿?¡!][\p{L}0-9]+)*[.,:;()¿?¡!]*$/u;
    let result = isEmptyOrNull(name, fieldName);

    if (result) return result;

    result = isString(name, fieldName);

    if (result) return result;

    if (!allowedName.test(name)) return `${ fieldName } debe tener solo letras, números, signos de puntuación o espacios.`;

    result = isLengthInRangeMin(name, 3, fieldName);

    if (result) return result;

    result = isLengthInRangeMax(name, 100, fieldName);

    return result;
}

export const validateName = (name) => validateText(name, 'El nombre');

export const validateLastName = (lastname) => validateText(lastname, 'El apellido');