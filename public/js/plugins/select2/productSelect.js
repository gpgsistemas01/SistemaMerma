import { openSupplierModal } from "../../modules/suppliers/supplierModal.js";
import { setupSupplierSelect, toggleSupplierOption } from "./domains/supplier.js";

const modalSelector = '#productModal';
const supplierSelector = '.supplier-select';

export const initProductFormSelect2 = () => {

    setupSupplierSelect({
        modalSelector,
        supplierSelector
    });
};

export const setProductFormSelectOptions = (data = null) => {
    
    toggleSupplierOption({
        selector: `${ modalSelector } ${ supplierSelector }`,
        supplierId: data?.supplierId,
        supplierName: data?.supplierName
    });
};