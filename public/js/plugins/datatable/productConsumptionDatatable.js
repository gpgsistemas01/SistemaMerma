import { openProductConsumptionModal } from "../../pages/warehouse/productConsumptionsPage.js";
import { createDataTable, refreshProductTable } from "./baseDatatable.js";
import { PRODUCT_CONSUMPTIONS_API_ROUTE } from "../../services/warehouse/productConsumptionService.js";

export let details = [];
const selectorProductTable = '#productTable';
const selectorTable = '#table';

export const createProductConsumptionDatatable = () => {
    const table = createDataTable({
        options: {
            ajax: { url: PRODUCT_CONSUMPTIONS_API_ROUTE },
            columns: [
                { data: 'referenceNumber', title: 'Folio' },
                {
                    data: null,
                    title: 'Proyecto',
                    render: (data, type, row) => `${ row.project.referenceNumber } - ${ row.project.name }`
                },
                {
                    data: null,
                    title: 'Encargado',
                    render: (data, type, row) => `${ row.requester.name } ${ row.requester.lastName }`
                },
                { data: 'machine.name', title: 'Máquina' },
                {
                    data: 'id',
                    title: 'Acciones',
                    render: () => `<button class="btn-edit">✏️</button><button class="btn-view">👁️</button>`
                }
            ],
            buttons: [{
                text: 'Nuevo consumo',
                action: () => openProductConsumptionModal({ mode: 'create' })
            }]
        }
    });

    $(`${ selectorTable } tbody`).on('click', '.btn-edit', async function() {
        const data = table.row($(this).closest('tr')).data();
        await openProductConsumptionModal({ mode: 'edit', data });
    });

    $(`${ selectorTable } tbody`).on('click', '.btn-view', function() {
        const data = table.row($(this).closest('tr')).data();
        openProductConsumptionModal({ mode: 'view', data });
    });
};

export const initDetailsProductConsumptionTable = (mode) => {
    if ($.fn.DataTable.isDataTable(selectorProductTable)) {
        $(selectorProductTable).DataTable().clear().destroy();
        $(selectorProductTable).empty();
    }

    const columns = [
        { data: 'name', title: 'Producto' },
        { data: 'goodsIssueReferenceNumber', title: 'Salida de almacén' },
        { data: 'consumedSquareMeters', title: 'M² consumidos' }
    ];

    if (mode !== 'view') {
        columns.push({
            title: 'Acciones',
            data: null,
            render: (data, type, row, meta) => `<button class="btn btn-danger btn-sm delete-btn" data-index="${ meta.row }">Eliminar</button>`
        });
    }

    createDataTable({
        selector: selectorProductTable,
        options: { data: details, columns }
    });
};

$(selectorProductTable).on('click', '.delete-btn', function() {
    const index = $(this).data('index');
    details.splice(index, 1);
    refreshProductTable(details);
});
