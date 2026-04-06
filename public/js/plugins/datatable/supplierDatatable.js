import { setFormReadOnly } from "../../utils/formUtils.js";
import { createDataTable } from "./baseDatatable.js";

const selectorTable = '#table';

export const createSupplierDatatable = () => {
    
    const table = createDataTable({
            options: {
            ajax: '/api/warehouse/suppliers',
            columns: [
                { data: 'name', title: 'Nombre' },
                { data: 'numberphone', title: 'Telefóno' },
                { 
                    data: 'isActive',
                    title: 'Estado',
                    render: (data) => data ? 'Activo' : 'Inactivo'
                },
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
                    text: 'Nuevo proveedor',
                    action: () => {
                        openSupplierModal({ mode: 'create' });
                    }
                }
            ]
        }
    });

    $(`${ selectorTable } tbody`).on('click', '.btn-edit', function() {

        const data = table.row($(this).closest('tr')).data();

        openSupplierModal({ mode: 'edit', data });
    });

    $(`${ selectorTable } tbody`).on('click', '.btn-view', function() {

        const data = table.row($(this).closest('tr')).data();

        openSupplierModal({ mode: 'view', data });
    });
}

const openSupplierModal = ({ mode, data = null }) => {

    const form = document.getElementById('form');

    form.dataset.mode = mode;
    form.dataset.id = data?.id || '';

    setFormReadOnly({ form, isReadOnly: false });

    if (mode === 'create') {

        form.reset();
        document.getElementById('modalTitle').textContent = 'Registrar proveedor';
        document.getElementById('submitBtn').textContent = 'Guardar';
    }

    if (mode === 'edit' || mode === 'view') {

        document.getElementById('nameInput').value = data.name;
        document.getElementById('numberphoneInput').value = data.numberphone || '';
        document.getElementById('isActiveInput').checked = data.isActive;

        if (mode === 'edit') {

            document.getElementById('modalTitle').textContent = 'Editar proveedor';
            document.getElementById('submitBtn').textContent = 'Actualizar';
        }

        if (mode === 'view') {

            document.getElementById('modalTitle').textContent = 'Ver proveedor';

            setFormReadOnly({ form, isReadOnly: true });
        }
    }

    const modalElement = document.getElementById('modal');
    const modal = mdb.Modal.getOrCreateInstance(modalElement);
    modal.show();
}