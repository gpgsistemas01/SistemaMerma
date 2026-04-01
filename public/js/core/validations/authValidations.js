import { includeSpace, includeUppercase, isEmptyOrNull, isLengthInRangeMax, isLengthInRangeMin, isString } from "./validations.js";

export const validatePassword = (password) => {

    const allowedNumber = /\d/;
    const allowedPassword = /^[A-Za-z0-9!@#\$%\^&\*]+$/;
    const fieldName = 'La contraseña ';
    let result = isEmptyOrNull(password, fieldName);

    if (result) return result;

    result = isString(password, fieldName);

    if (result) return result;

    result = includeUppercase(password, fieldName);

    if (result) return result;

    if (!allowedNumber.test(password)) return `${ fieldName }debe tener al menos un número.`;

    if (!allowedPassword.test(password)) return  `${ fieldName }debe tener al menos un símbolo especial.`;

    result = isLengthInRangeMin(password, 6, fieldName);

    if (result) return result;

    result = isLengthInRangeMax(password, 100, fieldName);

    return result;
}

export const validateRepeatedPassword = (repeatedPassword, password) => {

    if (repeatedPassword !== password) return 'La contraseña no coincide';

    return null;
}

export const validateUsername = (username) => {

    const allowedUsername = /^[a-zA-Z0-9_]+$/;
    const fieldName = 'El nombre de usuario ';
    let result = isEmptyOrNull(username, fieldName);

    if (result) return result;

    result = isString(username, fieldName);

    if (result) return result;

    result = includeSpace(username, fieldName);

    if (result) return result;

    result = includeUppercase(username, fieldName);

    if (result) return result;

    if (!allowedUsername.test(username)) return `${ fieldName }debe tener solo letras, numeros y guiones bajos`;
    
    result = isLengthInRangeMax(username, 100, fieldName);

    if (result) return result;

    result = isLengthInRangeMin(username, 3, fieldName);

    return result;
}