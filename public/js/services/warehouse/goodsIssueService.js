import { apiRequest } from "../axiosInstanceApi.js";

const route = '/api/warehouse';

export const registerGoodsIssueRequest = (data) => apiRequest({
    method: 'post',
    url: `${ route }/goods-issues`,
    data
});

export const editGoodsIssueRequest = (data, id) => apiRequest({
    method: 'put',
    url: `${ route }/goods-issues/${ id }`,
    data
});
