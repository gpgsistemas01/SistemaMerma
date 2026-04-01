import { getErrorMessage } from "../../../constants/apiMessages.js";

export const mapServerErrors = (serverErrors) => {

    const errors = {};

    for (const field in serverErrors) {

        errors[field] = getErrorMessage(serverErrors[field]);
    }

    return errors;
}