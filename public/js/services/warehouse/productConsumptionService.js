import axiosApi from "../axiosInstanceApi.js";

export const PRODUCT_CONSUMPTIONS_API_ROUTE = '/api/warehouse/product-consumptions';

export const registerProductConsumptionRequest = async (formData) =>
    await axiosApi.post(PRODUCT_CONSUMPTIONS_API_ROUTE, formData);

export const editProductConsumptionRequest = async (formData, id) =>
    await axiosApi.put(`${ PRODUCT_CONSUMPTIONS_API_ROUTE }/${ id }`, formData);
