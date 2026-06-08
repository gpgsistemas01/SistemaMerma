import { mapSupplierProductToSelectData } from "../../../utils/productSelectUtils.js";
import { initReasonSelect, toggleReasonOption } from "../domains/reason.js";
import { setupSupplierProductSelect, toggleSupplierProductOption } from "../domains/supplierProduct.js";

const productSelector = '#productInput';
const reasonSelector = '#reasonInput';

export const initWasteSelect2 = ({ modalSelector }) => {

    setupSupplierProductSelect({
        modalSelector,
        productSelector
    });

    initReasonSelect({
        modalSelector,
        baseSelector: `${ modalSelector } ${ reasonSelector }`,
        allowCreate: false
    });

};

export const setWasteSelectOptions = ({ modalSelector, data = null }) => {

    toggleSupplierProductOption({
        selector: `${ modalSelector } ${ productSelector }`,
        data: data ? mapSupplierProductToSelectData(data) : null,
        modalSelector
    });

    toggleReasonOption({
        selector: `${ modalSelector } ${ reasonSelector }`,
        id: data?.reason?.id,
        name: data?.reason?.name
    });
};
