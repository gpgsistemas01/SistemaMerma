import { getSuccessMessage } from "../../constants/apiMessages.js";
import { editGoodsReceiptRequest, registerGoodsReceiptRequest } from "../../services/warehouse/goodsReceiptService.js";

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