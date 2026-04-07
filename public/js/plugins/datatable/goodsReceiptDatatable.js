import { openGoodsReceiptModal } from "../../pages/warehouse/goodsReceiptsPage.js";
import { createDataTable, refreshProductTable } from "./baseDatatable.js";

export let details = [];
const selectorProductTable = '#productTable';
const selectorTable = '#table';

export const createGoodsReceiptDatatable = () => {
    
    const table = createDataTable({
        options: {
            ajax: '/api/warehouse/goods-receipts/',
            columns: [
                { data: 'referenceNumber', title: 'Folio' },
                { 
                    data: null,
                    title: 'Recepción',
                    render: (data, type, row) => {

                        const name = `${ row.receivedBy.name } ${ row.receivedBy.lastName }`;
                        const date = new Date(row.receptionDate).toLocaleString();

                        return `<div>${ name }<br><small>${ date }</small></div>`;
                    }
                },
                { data: 'supplier.name', title: 'Proveedor' },
                { data: 'status.name', title: 'Estado' },
                {
                    data: 'id',
                    title: 'Acciones',
                    render: () => {
                        return `
                            <button class="btn-edit">✏️</button>
                            <button class="btn-view">👁️</button>
                        `;
                    }
                }
            ],
            buttons: [
                {
                    text: 'Nueva recepción',
                    action: () => {
                        openGoodsReceiptModal({ mode: 'create' });
                    }
                }
            ]
        }
    });

    $(`${ selectorTable } tbody`).on('click', '.btn-edit', async function() {

        const data = table.row($(this).closest('tr')).data();

        await openGoodsReceiptModal({ mode: 'edit', data });
    });

    $(`${ selectorTable } tbody`).on('click', '.btn-view', function() {

        const data = table.row($(this).closest('tr')).data();

        openGoodsReceiptModal({ mode: 'view', data });
    });
}

export const initDetailsGoodsReceiptTable = (mode) => {

    if ($.fn.DataTable.isDataTable(selectorProductTable)) {
        $(selectorProductTable).DataTable().clear().destroy();
        $(selectorProductTable).empty();
    }

    const columns = [
        { data: 'name', title: 'Producto' },
        { data: 'quantity', title: 'Cantidad' },
        { data: 'description', title: 'Descripción' },
    ];

    if (mode !== 'view') columns.push({
        title: 'Acciones',
        data: null,
        render: (data, type, row, meta) => {
            return `
                <button class="btn btn-danger btn-sm delete-btn" data-index="${meta.row}">
                    Eliminar
                </button>
            `;
        }
    });

    const table = createDataTable({
        selector: selectorProductTable, 
        options: {
            data: details,
            columns
        }
    });
}

$(selectorProductTable).on('click', '.delete-btn', function () {

    const index = $(this).data('index');

    details.splice(index, 1);

    refreshProductTable(details);
});