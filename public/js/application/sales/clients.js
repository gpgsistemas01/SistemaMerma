import { createSuccessResponseFromRequest } from "../../utils/responseUtils.js";
import { createClientRequest, editClientRequest, getAllClientsRequest } from "../../services/sales/clientService.js";

export const getAllClients = async (params = {}) => {

    const response = await getAllClientsRequest({ params });

    return response;
};

export const registerClient = async ({ formData }) => {

    const response = await createClientRequest({ data: formData });

    return createSuccessResponseFromRequest({ response, dataKey: 'client' });
}

export const editClient = async ({ formData, id }) => {

    const response = await editClientRequest({ data: formData, id });

    return createSuccessResponseFromRequest({ response, dataKey: 'client' });
}
