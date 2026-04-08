import { initbaseSelect2 } from "./baseSelect.js";

export const initProductConsumptionSelect2 = async (data = null) => {
    const projectSelector = '#projectInput';
    const requesterSelector = '#requesterInput';
    const machineSelector = '#machineInput';
    const productSelector = '#productInput';
    const goodsIssueSelector = '#goodsIssueInput';

    initbaseSelect2({
        selector: projectSelector,
        url: '/api/admin/projects/',
        placeholder: 'Buscar proyecto...',
        processResults: (data) => ({
            results: (data.data || data).map(project => ({
                id: project.id,
                text: `${ project.referenceNumber } - ${ project.name }`
            }))
        })
    });

    initbaseSelect2({
        selector: requesterSelector,
        url: '/api/admin/profiles/',
        placeholder: 'Buscar responsable...',
        processResults: (data) => ({
            results: (data.data || data).map(profile => ({
                id: profile.id,
                text: `${ profile.name } ${ profile.lastName }`
            }))
        })
    });

    initbaseSelect2({
        selector: machineSelector,
        url: '/api/warehouse/product-consumptions/machines',
        placeholder: 'Buscar máquina...',
        processResults: (data) => ({
            results: (data.data || data).map(machine => ({
                id: machine.id,
                text: machine.name
            }))
        })
    });

    initbaseSelect2({
        selector: productSelector,
        url: '/api/warehouse/products/',
        placeholder: 'Buscar producto...',
        processResults: (data) => ({
            results: (data.data || data).map(product => ({
                id: product.id,
                text: product.name
            }))
        })
    });

    initbaseSelect2({
        selector: goodsIssueSelector,
        url: '/api/warehouse/goods-issues/',
        placeholder: 'Buscar salida...',
        processResults: (data) => ({
            results: (data.data || data).map(goodsIssue => ({
                id: goodsIssue.id,
                text: goodsIssue.referenceNumber
            }))
        })
    });

    if (data) {
        $(projectSelector).append(new Option(`${ data.project.referenceNumber } - ${ data.project.name }`, data.project.id, true, true)).trigger('change');
        $(requesterSelector).append(new Option(`${ data.requester.name } ${ data.requester.lastName }`, data.requester.id, true, true)).trigger('change');
        $(machineSelector).append(new Option(data.machine.name, data.machine.id, true, true)).trigger('change');
    } else {
        $(projectSelector).empty().trigger('change');
        $(requesterSelector).empty().trigger('change');
        $(machineSelector).empty().trigger('change');
    }
};
