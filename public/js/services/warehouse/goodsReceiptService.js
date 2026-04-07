import { apiRequest } from "../axiosInstanceApi.js";

export const GOODS_RECEIPTS_API_ROUTE = '/api/warehouse/goods-receipts';

export const registerGoodsReceiptRequest = (data) => apiRequest({
    method: 'post',
    url: GOODS_RECEIPTS_API_ROUTE,
    data
});

export const editGoodsReceiptRequest = (data, id) => apiRequest({
    method: 'put',
    url: `${ GOODS_RECEIPTS_API_ROUTE }/${ id }`,
    data
});

export const confirmGoodsReceiptRequest = (id) => apiRequest({
    method: 'patch',
    url: `${ GOODS_RECEIPTS_API_ROUTE }/${ id }/confirm`
});

export const cancelGoodsReceiptRequest = (id) => apiRequest({
    method: 'patch',
    url: `${ GOODS_RECEIPTS_API_ROUTE }/${ id }/cancel`
});
