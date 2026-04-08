import { getErrorMessage, getSuccessMessage } from "../../constants/apiMessages.js";
import { editProductConsumptionRequest, registerProductConsumptionRequest } from "../../services/warehouse/productConsumptionService.js";

export const registerProductConsumption = async (formData) => {
    try {
        const response = await registerProductConsumptionRequest(formData);
        return { message: getSuccessMessage(response.data.code) };
    } catch (err) {
        if (err.response?.status === 404) {
            err.message = getErrorMessage(err.response.data.code);
        }
        throw err;
    }
};

export const editProductConsumption = async (formData, id) => {
    try {
        const response = await editProductConsumptionRequest(formData, id);
        return { message: getSuccessMessage(response.data.code) };
    } catch (err) {
        if (err.response?.status === 404) {
            err.message = getErrorMessage(err.response.data.code);
        }
        throw err;
    }
};
