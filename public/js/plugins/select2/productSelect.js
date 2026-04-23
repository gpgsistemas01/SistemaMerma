import { openSupplierModal } from "../../modules/suppliers/supplierModal.js";
import { initPresentationSelect } from "./domains/presentations.js";
import { setupSupplierSelect, toggleSupplierOption } from "./domains/supplier.js";
import { initUnitMeasureSelect } from "./domains/unitMeasures.js";

const modalSelector = '#productModal';
const supplierSelector = '.supplier-select';
const unitMeasureSelector = '#unitMeasureInput';
const presentationSelector = '#presentationInput';

export const initProductFormSelect2 = () => {

    setupSupplierSelect({
        modalSelector,
        supplierSelector
    });

    initUnitMeasureSelect({
        modalSelector,
        baseSelector: unitMeasureSelector,
        allowCreate: false
    });

    initPresentationSelect({
        modalSelector,
        baseSelector: presentationSelector,
        allowCreate: false
    });
};

export const setProductFormSelectOptions = (data = null) => {
    
    toggleSupplierOption({
        selector: `${ modalSelector } ${ supplierSelector }`,
        supplierId: data?.supplierId,
        supplierName: data?.supplierName
    });
};