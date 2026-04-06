import { getSuccessMessage } from "../../constants/apiMessages.js";
import { editGoodsIssueRequest, registerGoodsIssueRequest } from "../../services/warehouse/goodsIssueService.js";

export const registerGoodsIssue = async (formData) => {

    const response = await registerGoodsIssueRequest(formData);

    const { data } = response;
    const { code } = data;
    const message = getSuccessMessage(code);

    return { message };
};

export const editGoodsIssue = async (formData, id) => {

    const response = await editGoodsIssueRequest(formData, id);

    const { data } = response;
    const { code } = data;
    const message = getSuccessMessage(code);

    return { message };
};
