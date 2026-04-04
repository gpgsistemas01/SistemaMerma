import { getErrorMessage, getSuccessMessage } from "../../constants/apiMessages.js";
import { editProductRequest, registerProductRequest } from "../../services/warehouse/productService.js";

export const registerProduct = async (formData) => {

    const response = await registerProductRequest(formData);

    const { data } = response;
    const { code } = data;
    const message = getSuccessMessage(code);

    return {
        message
    };
}

export const editProduct = async (formData, id) => {

    try {

        const response = await editProductRequest(formData, id);

        const { data } = response;
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