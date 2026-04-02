import { isNumberphone } from "./validations.js";

export const validateNumberphone = (value) => {

    if (value) {

        let result = isNumberphone(value);

        return result;
    }

    return null;
}