import { apiRequest } from "../axiosInstanceApi.js";

export const GOODS_RECEIPTS_API_ROUTE = '/api/warehouse/goods-receipts';

export const registerGoodsReceiptRequest = (data) => apiRequest({
    method: 'post',
    url: GOODS_RECEIPTS_API_ROUTE,
    data
});
