import { getErrorMessage, getSuccessMessage } from "../../constants/apiMessages.js";
import { cancelPurchaseRequisitionRequest, confirmPurchaseRequisitionRequest, editPurchaseRequisitionRequest, registerPurchaseRequisitionRequest } from "../../services/warehouse/purchaseRequisitionService.js";

export const registerPurchaseRequisition = async (formData) => {

    try {

        const response = await registerPurchaseRequisitionRequest(formData);

        const { data } = response;
        const { code } = data;
        const message = getSuccessMessage(code);

        return {
            message
        };

    } catch (err) {

        if (err.response) {

            const { data, status } = err.response;

            if (status === 404) {
                err.message = getErrorMessage(data.code);
            }
        }

        throw err;
    }
};

export const editPurchaseRequisition = async (formData, id) => {

    try {

        const response = await editPurchaseRequisitionRequest(formData, id);

        const { data } = response;
        const { code } = data;
        const message = getSuccessMessage(code);

        return {
            message
        };

    } catch (err) {

        if (err.response) {

            const { data, status } = err.response;

            if (status === 404) {
                err.message = getErrorMessage(data.code);
            }
        }

        throw err;
    }
};

export const cancelPurchaseRequisition = async (id) => {

    try {
    
        const response = await cancelPurchaseRequisitionRequest(id);

        const { data } = response;
        const { code } = data;
        let message = getSuccessMessage(code);

        return {
            message
        };

    } catch (err) {

        if (err.response) {

            let message;
            const { data, status } = err.response;

            switch (status) {

                case 404:
                    message = getErrorMessage(data.code);
                    err.message = message;
                    throw err;
                default:
                    throw err;
            }

        } else {

            throw err;
        }
    }
}

export const confirmPurchaseRequisition = async (id) => {

    try {
    
        const response = await confirmPurchaseRequisitionRequest(id);

        const { data } = response;
        const { code } = data;
        let message = getSuccessMessage(code);

        return {
            message
        };

    } catch (err) {

        if (err.response) {

            let message;
            const { data, status } = err.response;

            switch (status) {

                case 404:
                    message = getErrorMessage(data.code);
                    err.message = message;
                    throw err;
                default:
                    throw err;
            }

        } else {

            throw err;
        }
    }
}