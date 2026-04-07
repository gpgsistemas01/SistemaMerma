import { openPurchaseRequisitionModal } from "../../pages/warehouse/purchaseRequisitionsPage.js";
import { createDataTable, refreshProductTable } from "./baseDatatable.js";
import { PURCHASE_REQUISITIONS_API_ROUTE } from "../../services/warehouse/purchaseRequisitionService.js";

export let details = [];
const selectorProductTable = '#productTable';
const selectorTable = '#table';

export const createPurchaseRequisitionDatatable = (context) => {

    const isWarehouseDepartment = context.department === 'Almacén';
    const isSystemDepartment = context.department === 'Sistemas';
    const columns = [
        { data: 'referenceNumber', title: 'Folio' },
        {
            data: null,
            title: 'Solicitud',
            render: (data, type, row) => {

                const name = `${ row.requester.name } ${ row.requester.lastName }`;
                const date = new Date(row.requestDate).toLocaleString();

                return `<div>${ name }<br><small>${ date }</small></div>`;
            }
        }
    ];

    if (isWarehouseDepartment || isSystemDepartment) {
        columns.push({
            data: 'department.name',
            title: 'Área'
        });
    }

    columns.push(
        {
            data: null,
            title: 'Proyecto',
            render: (data, type, row) => {

                const projectDate = new Date(row.project.date).toLocaleDateString();
                return `<div>${ row.project.referenceNumber } - ${ row.project.name }<br><small>${ row.project.client } | ${ projectDate }</small></div>`;
            }
        },
        {
            data: null,
            title: 'Aprobación',
            render: (data, type, row) => {

                if (!row.approverId || !row.authDate) return '<small>Sin autorizar</small>';

                const approver = `${ row.approver.name } ${ row.approver.lastName }`;
                const authDate = new Date(row.authDate).toLocaleString();

                return `<div>${ approver }<br><small>${ authDate }</small></div>`;
            }
        },
        {
            data: null,
            title: 'Entrega',
            render: (data, type, row) => {

                if (!row.deliveredBy || !row.deliveryDate) return '<small>Sin entrega</small>';

                const deliveredBy = `${ row.deliveredBy.name } ${ row.deliveredBy.lastName }`;
                const deliveryDate = new Date(row.deliveryDate).toLocaleString();

                return `<div>${ deliveredBy }<br><small>${ deliveryDate }</small></div>`;
            }
        },
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
    );

    const table = createDataTable({
        options: {
            ajax: {
                url: PURCHASE_REQUISITIONS_API_ROUTE,
                data: (d) => {
                    d.department = context.department || '';
                }
            },
            columns,
            buttons: [
                {
                    text: 'Nueva requisición',
                    action: () => {
                        openPurchaseRequisitionModal({ mode: 'create' });
                    }
                }
            ]
        }
    });

    $(`${ selectorTable } tbody`).on('click', '.btn-edit', async function() {

        const data = table.row($(this).closest('tr')).data();

        await openPurchaseRequisitionModal({ mode: 'edit', data });
    });

    $(`${ selectorTable } tbody`).on('click', '.btn-view', function() {

        const data = table.row($(this).closest('tr')).data();

        openPurchaseRequisitionModal({ mode: 'view', data });
    });
};

export const initDetailsPurchaseRequisitionTable = (mode) => {

    if ($.fn.DataTable.isDataTable(selectorProductTable)) {
        $(selectorProductTable).DataTable().clear().destroy();
        $(selectorProductTable).empty();
    }

    const columns = [
        { data: 'name', title: 'Producto' },
        { data: 'quantity', title: 'Cantidad' },
        { data: 'description', title: 'Descripción' },
    ];

    if (mode !== 'view') {
        columns.push({
            title: 'Acciones',
            data: null,
            render: (data, type, row, meta) => {
                return `
                    <button class="btn btn-danger btn-sm delete-btn" data-index="${ meta.row }">
                        Eliminar
                    </button>
                `;
            }
        });
    }

    createDataTable({
        selector: selectorProductTable,
        options: {
            data: details,
            columns
        }
    });
};

$(selectorProductTable).on('click', '.delete-btn', function() {

    const index = $(this).data('index');

    details.splice(index, 1);

    refreshProductTable(details);
});