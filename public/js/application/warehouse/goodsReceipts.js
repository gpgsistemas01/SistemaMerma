import { getErrorMessage, getSuccessMessage } from "../../constants/apiMessages.js";
import {
    cancelGoodsReceiptRequest,
    confirmGoodsReceiptRequest,
    editGoodsReceiptRequest,
    registerGoodsReceiptRequest
} from "../../services/warehouse/goodsReceiptService.js";

export const registerGoodsReceipt = async (formData) => {

    try {

        const response = await registerGoodsReceiptRequest(formData);

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

export const editGoodsReceipt = async (formData, id) => {

    try {

        const response = await editGoodsReceiptRequest(formData, id);

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

        } else throw err;
    }
}

export const confirmGoodsReceipt = async (id) => {

    try {

        const response = await confirmGoodsReceiptRequest(id);
        const { code } = response.data;

        return {
            message: getSuccessMessage(code)
        };
    } catch (err) {

        if (err.response?.status === 404) {
            err.message = getErrorMessage(err.response.data.code);
        }

        throw err;
    }
};

export const cancelGoodsReceipt = async (id) => {

    try {

        const response = await cancelGoodsReceiptRequest(id);
        const { code } = response.data;

        return {
            message: getSuccessMessage(code)
        };
    } catch (err) {

        if (err.response?.status === 404) {
            err.message = getErrorMessage(err.response.data.code);
        }

        throw err;
    }
};
