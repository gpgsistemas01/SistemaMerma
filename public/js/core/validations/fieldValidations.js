import { includeSpace, includeUppercase, isDate, isEmptyOrNull, isLengthInRangeMax, isLengthInRangeMin, isNegative, isNumber, isNumberphone, isString } from "./baseValidations.js";

export const validatePassword = (password) => {

    const allowedNumber = /\d/;
    const allowedPassword = /^[A-Za-z0-9!@#\$%\^&\*]+$/;
    const fieldName = 'La contraseña';
    let result = isEmptyOrNull(password, fieldName);

    if (result) return result;

    result = isString(password, fieldName);

    if (result) return result;

    result = includeUppercase(password, fieldName);

    if (result) return result;

    if (!allowedNumber.test(password)) return `${ fieldName } debe tener al menos un número.`;

    if (!allowedPassword.test(password)) return  `${ fieldName }debe tener al menos un símbolo especial.`;

    result = isLengthInRangeMin(password, 6, fieldName);

    if (result) return result;

    result = isLengthInRangeMax(password, 50, fieldName);

    return result;
}

export const validateUsername = (username) => {

    const allowedUsername = /^[a-zA-Z0-9_]+$/;
    const fieldName = 'El nombre de usuario';
    let result = isEmptyOrNull(username, fieldName);

    if (result) return result;

    result = isString(username, fieldName);

    if (result) return result;

    result = includeSpace(username, fieldName);

    if (result) return result;

    result = includeUppercase(username, fieldName);

    if (result) return result;

    if (!allowedUsername.test(username)) return `${ fieldName } debe tener solo letras, numeros y guiones bajos`;
    
    result = isLengthInRangeMax(username, 50, fieldName);

    return result;
}

export const validateNumberphone = (value) => {

    if (!value) return null;

    let result = isNumberphone(value);

    return result;

}

export const validateNumber = (number, fieldName) => {

    let result = isEmptyOrNull(number, fieldName);

    if (result) return result;

    number = parseFloat(number);

    result = isNumber(number, fieldName);

    if (result) return result;

    result = isNegative(number, fieldName);

    return result;
}

export const validateExpiryDate = (expiryDate) => {

    if (!expiryDate) return null;

    const fieldName = 'La fecha de vencimiento';
    const result = isDate(expiryDate, fieldName);

    return result;
}

export const validateDimension = (dimension, fieldName) => {

    if (!dimension) return null;

    let result = isEmptyOrNull(dimension, fieldName);

    if (result) return result;

    dimension = parseFloat(dimension);

    result = isNumber(dimension, fieldName);

    return result;
}

export const validateText = (name, fieldName) => {

    const allowedName = /^[\p{L}0-9]+(?:[ '\-.,:;()¿?¡!][\p{L}0-9]+)*[.,:;()¿?¡!]*$/u;
    let result = isEmptyOrNull(name, fieldName);

    if (result) return result;

    result = isString(name, fieldName);

    if (result) return result;

    if (!allowedName.test(name)) return `${ fieldName } debe tener solo letras, números, signos de puntuación o espacios.`;

    result = isLengthInRangeMax(name, 50, fieldName);

    return result;
}

export const validateTextOptional = (name, fieldName) => {

    if (!name) return null;

    const result = validateText(name, fieldName);

    return result;
}

export const validateName = (name) => validateText(name, 'El nombre');