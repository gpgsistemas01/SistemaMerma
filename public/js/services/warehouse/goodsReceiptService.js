import { apiRequest } from "../axiosInstanceApi.js";

const route = '/api/warehouse';

export const registerGoodsReceiptRequest = (data) => apiRequest({
    method: 'post',
    url: `${ route }/goods-receipts`,
    data
});

export const editGoodsReceiptRequest = (data, id) => apiRequest({
    method: 'put',
    url: `${ route }/goods-receipts/${ id }`,
    data
});

export const confirmGoodsReceiptRequest = (id) => apiRequest({
    method: 'patch',
    url: `${ route }/goods-receipts/${ id }/confirm`
});

export const cancelGoodsReceiptRequest = (id) => apiRequest({
    method: 'patch',
    url: `${ route }/goods-receipts/${ id }/cancel`
});
