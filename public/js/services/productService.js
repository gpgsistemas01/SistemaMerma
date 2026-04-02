import { apiRequest } from "./axiosInstanceApi.js";

const route = '/api/warehouse';

export const registerProductRequest = (data) => apiRequest({
    method: 'post',
    url: `${ route }/products`,
    data
});

export const editProductRequest = (data, id) => apiRequest({
    method: 'put',
    url: `${ route }/products/${ id }`,
    data
});