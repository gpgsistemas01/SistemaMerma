import { initbaseSelect2 } from "./baseSelect.js";

export const initGoodsIssueSelect2 = async (data = null) => {

    const requesterSelector = '#requesterInput';
    const projectSelector = '#projectInput';
    const productSelector = '#productInput';

    initbaseSelect2({
        selector: requesterSelector,
        url: '/api/admin/profiles',
        placeholder: 'Buscar solicitante...',
        processResults: (data) => {

            const list = data.data || data;

            return {
                results: list.map(profile => ({
                    id: profile.id,
                    text: `${ profile.name } ${ profile.lastName }`
                }))
            };
        }
    });

    initbaseSelect2({
        selector: projectSelector,
        url: '/api/admin/projects/',
        placeholder: 'Buscar proyecto...',
        processResults: (data) => {

            const list = data.data || data;

            return {
                results: list.map(project => ({
                    id: project.id,
                    text: `${ project.referenceNumber } - ${ project.name }`
                }))
            };
        }
    });

    initbaseSelect2({
        selector: productSelector,
        url: '/api/warehouse/products/',
        placeholder: 'Buscar producto...',
        processResults: (data) => {

            const list = data.data || data;

            return {
                results: list.map(product => ({
                    id: product.id,
                    text: product.name
                }))
            };
        }
    });

    if (data) {

        const requesterOption = new Option(`${ data.requester.name } ${ data.requester.lastName }`, data.requester.id, true, true);
        $(requesterSelector).append(requesterOption).trigger('change');
        const projectOption = new Option(`${ data.project.referenceNumber } - ${ data.project.name }`, data.project.id, true, true);
        $(projectSelector).append(projectOption).trigger('change');
        return;
    }

    $(requesterSelector).empty().trigger('change');
    $(projectSelector).empty().trigger('change');
};
