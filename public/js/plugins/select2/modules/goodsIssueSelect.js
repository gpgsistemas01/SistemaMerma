import { initAdvisorSelect, toggleAdvisorOption } from "../domains/advisor.js";
import { initClientSelect, toggleClientOption } from "../domains/client.js";
import { initDepartmentSelect, toggleDepartmentOption } from "../domains/department.js";
import { setupProductSelect, toggleProductOption } from "../domains/product.js";
import { initProfileSelect, toggleProfileOption } from "../domains/profile.js";

const modalSelector = '#goodsIssueModal';
const requesterSelector = '#requesterInput';
const clientSelector = '#clientInput';
const departmentSelector = '#departmentInput';
const advisorSelector = '#advisorInput';
const productSelector = '#productInput';

export const initGoodsIssueFormSelect2 = ({
    context
}) => {
    initDepartmentSelect({
        modalSelector,
        baseSelector: `${ modalSelector } ${ departmentSelector }`,
        allowCreate: false
    });

    initClientSelect({
        modalSelector,
        advisorSelector,
        baseSelector: `${ modalSelector } ${ clientSelector }`,
        allowCreate: false
    });

    initAdvisorSelect({
        modalSelector,
        baseSelector: `${ modalSelector } ${ advisorSelector }`,
        allowCreate: false
    });

    initProfileSelect({
        modalSelector, 
        baseSelector: `${ modalSelector } ${ requesterSelector }`,
        placeholder: 'Buscar solicitante...',
        data: (params) => {
            return {
                search: params.term
            };
        },
        allowCreate: false,
    });

    setupProductSelect({
        modalSelector,
        productSelector,
        allowCreate: false
    });
};

export const setGoodsIssueFormSelectOptions = (data = null) => {

    toggleDepartmentOption({
        selector: `${ modalSelector } ${ departmentSelector }`,
        id: data?.department?.id,
        name: data?.department?.name
    });

    toggleClientOption({
        selector: `${ modalSelector } ${ clientSelector }`,
        id: data?.client?.id,
        name: data?.client?.name
    });

    toggleAdvisorOption({
        selector: `${ modalSelector } ${ advisorSelector }`,
        id: data?.advisor?.id,
        name: data?.advisor?.name
    });

    toggleProfileOption({
        selector: `${ modalSelector } ${ requesterSelector }`,
        profileId: data?.project?.id,
        profileName: `${ data?.requester?.name } ${ data?.requester?.lastName }`, 
    });

    toggleProductOption({
        selector: `${ modalSelector } ${ productSelector }`,
        data: {
            id: null,
            text: null,
        }
    });
}
