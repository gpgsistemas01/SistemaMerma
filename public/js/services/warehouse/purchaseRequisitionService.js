import { apiRequest } from "../axiosInstanceApi.js";

const route = '/api/warehouse';

export const registerPurchaseRequisitionRequest = (data) => apiRequest({
    method: 'post',
    url: `${ route }/purchase-requisitions`,
    data
});

export const editPurchaseRequisitionRequest = (data, id) => apiRequest({
    method: 'put',
    url: `${ route }/purchase-requisitions/${ id }`,
    data
});

export const confirmPurchaseRequisitionRequest = (id) => apiRequest({
    method: 'patch',
    url: `${ route }/purchase-requisitions/${ id }/confirm`
});

export const cancelPurchaseRequisitionRequest = (id) => apiRequest({
    method: 'patch',
    url: `${ route }/purchase-requisitions/${ id }/cancel`
});
