import { formatDateLongWithTime } from "../../utils/formatters.js";
import { setFormReadOnly } from "../../utils/formUtils.js";
import { initGoodsReceiptSelect2 } from "../select2/goodsReceiptSelect.js";
import { createDataTable } from "./baseDatatable.js";

export let details = [];
const selectorProductTable = '#productTable';
const selectorTable = '#table';

export const createGoodsReceiptDatatable = () => {
    
    const table = createDataTable({
        options: {
            ajax: '/api/warehouse/goods-receipts',
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

const openGoodsReceiptModal = async ({ mode, data = null }) => {

    const form = document.getElementById('form');

    form.dataset.mode = mode;
    form.dataset.id = data?.id || '';

    setFormReadOnly({ form, isReadOnly: false });

    if (mode === 'create') {
        
        form.reset();
        document.getElementById('modalTitle').textContent = 'Registrar recepción';
        document.getElementById('submitBtn').textContent = 'Guardar';
        details.length = 0;

        await initGoodsReceiptSelect2();
    }

    if (mode === 'edit' || mode === 'view') {

        document.getElementById('observationsInput').value = data.observations || '';
        document.getElementById('receptionDateInput').value = formatDateLongWithTime(data.receptionDate);
        details = data.details.map(detail => ({
            id: detail.id,
            name: detail.product.name,
            quantity: detail.quantity,
            description: detail.description,
            productId: detail.productId
        }));

        await initGoodsReceiptSelect2(data);

        if (mode === 'edit') {

            document.getElementById('modalTitle').textContent = 'Editar recepción';
            document.getElementById('submitBtn').textContent = 'Actualizar';
        }

        if (mode === 'view') {

            document.getElementById('modalTitle').textContent = 'Ver recepción';
            document.querySelector('.add-product-container').style.display = mode === 'view' ? 'none' : '';

            setFormReadOnly({ form, isReadOnly: true });
        }
    }

    initDetailsTable(mode)

    const modalElement = document.getElementById('modal');
    const modal = mdb.Modal.getOrCreateInstance(modalElement);
    modal.show();
}

export const initDetailsTable = (mode) => {

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

    refreshTable();
});

const refreshTable = () => {

    const table = $(selectorProductTable).DataTable();
    table.clear();
    table.rows.add(details);
    table.draw();
}

const addProduct = () => {

    const productId = document.getElementById('productInput').value;
    const productName = document.getElementById('productInput').selectedOptions?.[0]?.text || '';
    const quantity = document.getElementById('quantityInput').value;
    const description = document.getElementById('descriptionInput').value;

    if (!productId || !quantity) {
        alert('Por favor, complete los campos de producto y cantidad.');
        return;
    }

    if (isNaN(quantity) || parseFloat(quantity) < 1) {
        alert('La cantidad debe ser un número mayor a cero.');
        return;
    }

    if (description && description.trim().length > 50) {
        alert('La descripción debe tener como máximo 50 caracteres.');
        return;
    }

    const product = { productId: productId, name: productName, quantity, description };
    details.push(product);

    refreshTable();

    $('#productInput').empty().trigger('change');
    document.getElementById('quantityInput').value = '';
    document.getElementById('descriptionInput').value = '';
}

document.getElementById('addProductBtn').addEventListener('click', addProduct);