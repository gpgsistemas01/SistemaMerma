import { initProductSelect2 } from "../select2/productSelect.js";
import { createDataTable } from "./baseDatatable.js";

export const createProductDatatable = (tableId) => {
    
    const table = createDataTable(tableId, {
        ajax: '/api/warehouse/products',
        columns: [
            { data: 'name' },
            { 
                data: null,
                render: (data, type, row) => (row.base && row.height) ? `${row.base} x ${row.height}` : 'N/A'
            },
            { data: 'unitCost' },
            { data: 'currentStock' },
            { data: 'minStock' },
            { data: 'maxStock' },
            { 
                data: 'expiryDate',
                render: (data) => data ? new Date(data).toLocaleDateString() : 'N/A'
            },
            { 
                data: 'isActive', 
                render: (data) => data ? 'Activo' : 'Inactivo' 
            },
            {
                data: 'id',
                render: () => {
                    return `
                        <button class="btn-edit">✏️</button>
                    `;
                }
            }
        ],
        buttons: [
            {
                text: 'Nuevo producto',
                action: () => {
                    openProductModal({ mode: 'create' });
                }
            }
        ]
    });

    $(`#${ tableId } tbody`).on('click', '.btn-edit', async function() {

        const data = table.row($(this).closest('tr')).data();
        document.getElementById('categoryProductInput').value = data.categoryId;
        document.getElementById('uomProductInput').value = data.uomId;
        document.getElementById('nameProductInput').value = data.name;
        document.getElementById('unitCostProductInput').value = data.unitCost;
        document.getElementById('minStockProductInput').value = data.minStock;
        document.getElementById('maxStockProductInput').value = data.maxStock;
        document.getElementById('expiryDateProductInput').value = data.expiryDate ? data.expiryDate.split('T')[0] : '';
        document.getElementById('thicknessProductInput').value = data.thickness ?? '';
        document.getElementById('baseProductInput').value = data.base ?? '';
        document.getElementById('heightProductInput').value = data.height ?? '';
        document.getElementById('colorProductInput').value = data.color ?? '';
        document.getElementById('typeProductInput').value = data.type ?? '';
        document.getElementById('presentationProductInput').value = data.presentation ?? '';
        document.getElementById('isActiveProductInput').value = data.isActive;

        await openProductModal({ mode: 'edit', data });
    });
}

const openProductModal = async ({ mode, data = null }) => {
    const form = document.getElementById('productForm');

    form.dataset.mode = mode;
    form.dataset.id = data?.id || '';

    if (mode === 'create') {
        
        form.reset();
        document.getElementById('productModalTitle').textContent = 'Registrar producto';
        document.getElementById('saveProductBtn').textContent = 'Guardar';
        await initProductSelect2();
    }

    if (mode === 'edit') {

        document.getElementById('categoryProductInput').value = data.categoryId;
        document.getElementById('uomProductInput').value = data.uomId;
        document.getElementById('nameProductInput').value = data.name;
        document.getElementById('unitCostProductInput').value = data.unitCost;
        document.getElementById('minStockProductInput').value = data.minStock;
        document.getElementById('maxStockProductInput').value = data.maxStock;
        document.getElementById('expiryDateProductInput').value = data.expiryDate ? data.expiryDate.split('T')[0] : '';
        document.getElementById('thicknessProductInput').value = data.thickness ?? '';
        document.getElementById('baseProductInput').value = data.base ?? '';
        document.getElementById('heightProductInput').value = data.height ?? '';
        document.getElementById('colorProductInput').value = data.color ?? '';
        document.getElementById('typeProductInput').value = data.type ?? '';
        document.getElementById('presentationProductInput').value = data.presentation ?? '';
        document.getElementById('isActiveProductInput').value = data.isActive;
        document.getElementById('productModalTitle').textContent = 'Editar producto';
        document.getElementById('saveProductBtn').textContent = 'Actualizar producto';
        await initProductSelect2(data);
    }

    const modalElement = document.getElementById('modal');
    const modal = mdb.Modal.getOrCreateInstance(modalElement);
    modal.show();
};