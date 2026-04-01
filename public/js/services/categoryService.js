import { apiRequest } from "./axiosInstanceApi.js";

const route = '/api/warehouse';

export const registerCategoryRequest = (data) => apiRequest({
    method: 'post',
    url: `${ route }/categories`,
    data
});

export const editCategoryRequest = (data, id) => apiRequest({
    method: 'put',
    url: `${ route }/categories/${ id }`,
    data
});