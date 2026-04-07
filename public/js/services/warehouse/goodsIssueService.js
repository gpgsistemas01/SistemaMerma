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

export const cancelGoodsIssueRequest = (id) => apiRequest({
    method: 'patch',
    url: `${ route }/goods-issues/cancel/${ id }`
});

export const confirmGoodsIssueRequest = (id) => apiRequest({
    method: 'patch',
    url: `${ route }/goods-issues/confirm/${ id }`
});

export const rejectGoodsIssueRequest = (id) => apiRequest({
    method: 'patch',
    url: `${ route }/goods-issues/reject/${ id }`
});

export const approveGoodsIssueRequest = (id) => apiRequest({
    method: 'patch',
    url: `${ route }/goods-issues/approve/${ id }`
});