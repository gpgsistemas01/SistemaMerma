import { getErrorMessage, getSuccessMessage } from "../../constants/apiMessages.js";
import { editSupplierRequest, registerSupplierRequest } from "../../services/warehouse/supplierService.js";

export const registerSupplier = async (formData) => {

    const response = await registerSupplierRequest(formData);

    const { data } = response;
    const { code } = data;
    const message = getSuccessMessage(code);

    return {
        message
    };
}

export const editSupplier = async (formData, id) => {

    try {

        const response = await editSupplierRequest(formData, id);

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