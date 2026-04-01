import { getSuccessMessage } from "../../constants/apiMessages.js";
import { loginRequest } from "../../services/authService.js";

export const login = async (formData) => {

    const response = await loginRequest(formData);

    const message = getSuccessMessage(response.data.code);

    return {
        message
    };
}