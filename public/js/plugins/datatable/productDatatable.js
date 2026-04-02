import { createDataTable } from "./baseDatatable.js";

export const createProductDatatable = (tableId) => {
    
    const table = createDataTable(tableId, {
        ajax: '/api/warehouse/products',
        columns: [
            { data: 'name' },
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

    $(`#${ tableId } tbody`).on('click', '.btn-edit', function() {

        const data = table.row($(this).closest('tr')).data();

        document.getElementById('nameProductInput').value = data.name;

        openProductModal({ mode: 'edit', data });
    });
}

const openProductModal = ({ mode, data = null }) => {
    const form = document.getElementById('productForm');

    form.dataset.mode = mode;
    form.dataset.id = data?.id || '';

    if (mode === 'create') {
        form.reset();
        document.getElementById('productModalTitle').textContent = 'Registrar producto';
        document.getElementById('saveProductBtn').textContent = 'Guardar';
    }

    if (mode === 'edit') {
        document.getElementById('nameProductInput').value = data.name;
        document.getElementById('productModalTitle').textContent = 'Editar producto';
        document.getElementById('saveProductBtn').textContent = 'Actualizar producto';
    }

    const modalElement = document.getElementById('modal');
    const modal = mdb.Modal.getOrCreateInstance(modalElement);
    modal.show();
};