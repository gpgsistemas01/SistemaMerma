import { openProductModal } from "../../modules/products/productModal.js";
import { openSupplierModal } from "../../modules/suppliers/supplierModal.js";
import { initMdbWrapperInput, updateMdbWrapperInput } from "../mdb/baseInstance.js";
import { setupProductSelect } from "./domains/product.js";
import { initProfileSelect, toggleProfileOption } from "./domains/profiles.js";
import { setupSupplierSelect } from "./domains/supplier.js";

const modalSelector = '#goodsReceiptModal';
const productSelector = '#productInput';
const supplierSelector = '.supplier-select';
const receivedBySelector = '#receivedByInput';

export const initGoodsReceiptFormSelect2 = async (data = null) => {    

    setupSupplierSelect({
        modalSelector,
        supplierSelector
    });

    initProfileSelect({
        modalSelector, 
        baseSelector: `${ modalSelector } ${ receivedBySelector }`,
        placeholder: 'Buscar persona que recibe...',
        data: (params) => {

            return {
                search: params.term,
                department: 'Almacén',
                strictDepartmentFilter: true
            };
        },
        allowCreate: false,
    });

    setupProductSelect({
        modalSelector,
        supplierSelector,
        productSelector,
    });

    if (data) {

        const supplierOption = new Option(
            data.supplier.tradeName, 
            data.supplier.id, 
            true, 
            true
        );
        $(`${modalSelector} ${supplierSelector}`).append(supplierOption).trigger('change');
        const receivedByOption = new Option(
            `${data.receivedBy.name} ${data.receivedBy.lastName}`, 
            data.receivedBy.id, 
            true, 
            true
        );
        $(receivedBySelector).append(receivedByOption).trigger('change');

    } else {

        $(`${modalSelector} ${supplierSelector}`).empty().trigger('change');
        $(receivedBySelector).empty().trigger('change');
    }
}

export const setGoodsReceiptFormSelect = (data = null) => {

    toggleSupplierOption({
        selector: `${ modalSelector } ${ supplierSelector }`,
        supplierId: data?.supplier.id,
        supplierName: data?.supplier.tradeName
    });

    toggleProfileOption({
        selector: `${ modalSelector } ${ receivedBySelector }`,
        profileId: data?.receivedBy.id,
        profileName: `${data?.receivedBy.name} ${data?.receivedBy.lastName}`,
    });
}