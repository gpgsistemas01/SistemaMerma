import { initbaseSelect2 } from "./baseSelect.js";

export const initPurchaseRequisitionSelect2 = async (data = null) => {

    const projectSelector = '#projectInput';
    const requesterSelector = '#requesterInput';
    const productSelector = '#productInput';

    initbaseSelect2({
        selector: projectSelector,
        url: '/api/warehouse/projects/',
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
        selector: requesterSelector,
        url: '/api/admin/profiles/',
        placeholder: 'Buscar solicitante...',
        processResults: (data) => {

            const list = data.data || data;
            return {
                results: list.map(requester => ({
                    id: requester.id,
                    text: `${ requester.name } ${ requester.lastName }`
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

        const projectOption = new Option(
            `${ data.project.referenceNumber } - ${ data.project.name }`,
            data.project.id,
            true,
            true
        );
        $(projectSelector).append(projectOption).trigger('change');

        const requesterOption = new Option(
            `${ data.requester.name } ${ data.requester.lastName }`,
            data.requester.id,
            true,
            true
        );
        $(requesterSelector).append(requesterOption).trigger('change');

    } else {

        $(projectSelector).empty().trigger('change');
        $(requesterSelector).empty().trigger('change');
    }
};
