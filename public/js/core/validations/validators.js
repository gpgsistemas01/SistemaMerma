import { validatePassword, validateRepeatedPassword, validateUsername } from "./authValidations.js";
import { validateLastName, validateName } from "./profileValidations.js";
import { validateQuery } from "./searchValidations.js";

export const validators = {
    name: validateName,
    username: validateUsername,
    lastName: validateLastName,
    password: validatePassword,
    repeatedPassword: (value, data) => validateRepeatedPassword(value, data.password),
    q: validateQuery,
}