import { apiRequest } from "../axiosInstanceApi.js";

const route = '/api/warehouse';

export const registerSupplierRequest = (data) => apiRequest({
    method: 'post',
    url: `${ route }/suppliers`,
    data
});

export const editSupplierRequest = (data, id) => apiRequest({
    method: 'put',
    url: `${ route }/suppliers/${ id }`,
    data
});