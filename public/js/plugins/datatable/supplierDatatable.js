import { createDataTable } from "./baseDatatable.js";

export const createSupplierDatatable = (tableId) => {
    
    const table = createDataTable(tableId, {
        ajax: '/api/warehouse/suppliers',
        columns: [
            { data: 'name' },
            { data: 'numberphone' },
            { 
                data: 'isActive',
                render: (data, type, row) => {
                    return data ? 'Activo' : 'Inactivo';
                }
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
                text: 'Nuevo proveedor',
                action: () => {
                    openSupplierModal({ mode: 'create' });
                }
            }
        ]
    });

    $(`#${ tableId } tbody`).on('click', '.btn-edit', function() {

        const data = table.row($(this).closest('tr')).data();

        document.getElementById('nameSupplierInput').value = data.name;
        document.getElementById('numberphoneSupplierInput').value = data.numberphone;
        document.getElementById('isActiveSupplierInput').value = data.isActive;

        openSupplierModal({ mode: 'edit', data });
    });
}

const openSupplierModal = ({ mode, data = null }) => {
    const form = document.getElementById('supplierForm');

    form.dataset.mode = mode;
    form.dataset.id = data?.id || '';

    if (mode === 'create') {
        form.reset();
        document.getElementById('supplierModalTitle').textContent = 'Registrar proveedor';
        document.getElementById('saveSupplierBtn').textContent = 'Guardar';
    }

    if (mode === 'edit') {
        document.getElementById('nameSupplierInput').value = data.name;
        document.getElementById('numberphoneSupplierInput').value = data.numberphone;
        document.getElementById('isActiveSupplierInput').value = data.isActive;
        document.getElementById('supplierModalTitle').textContent = 'Editar proveedor';
        document.getElementById('saveSupplierBtn').textContent = 'Actualizar';
    }

    const modalElement = document.getElementById('modal');
    const modal = mdb.Modal.getOrCreateInstance(modalElement);
    modal.show();
};