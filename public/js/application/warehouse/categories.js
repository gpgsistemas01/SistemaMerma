import { getErrorMessage, getSuccessMessage } from "../../constants/apiMessages.js";
import { editCategoryRequest, registerCategoryRequest } from "../../services/categoryService.js";

export const registerCategory = async (formData) => {

    const response = await registerCategoryRequest(formData);

    const message = getSuccessMessage(response.data.code);

    return {
        message
    };
}

export const editCategory = async (formData, id) => {

    try {

        const response = await editCategoryRequest(formData, id);

        const { data, status } = response;
        const { code } = data;
        let message = getSuccessMessage(code);

        return {
            message
        };

    } catch (err) {

        let message;

        if (err.response) {
            const { data, status } = err.response;

            switch (status) {

                case 404:
                    message = getErrorMessage(data.code);
                    break;
                default:
                    message = 'Error inesperado';
            }

        } else {

            message = 'Error de conexión o timeout';
        }

        return {
            message,
        }
    }
}