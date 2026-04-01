import { createDataTable } from "./baseDatatable.js";

export const createCategoryDatatable = (tableId) => {
    
    const table = createDataTable(tableId, {
        ajax: '/api/warehouse/categories',
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
                text: 'Nueva categoría',
                action: () => {
                    openCategoryModal({ mode: 'create' });
                }
            }
        ]
    });

    $(`#${ tableId } tbody`).on('click', '.btn-edit', function() {

        const data = table.row($(this).closest('tr')).data();

        document.getElementById('nameCategoryInput').value = data.name;

        openCategoryModal({ mode: 'edit', data });
    });
}

const openCategoryModal = ({ mode, data = null }) => {
    const form = document.getElementById('categoryForm');

    form.dataset.mode = mode;
    form.dataset.id = data?.id || '';

    if (mode === 'create') {
        form.reset();
        document.getElementById('categoryModalTitle').textContent = 'Registrar categoría';
        document.getElementById('saveCategoryBtn').textContent = 'Guardar';
    }

    if (mode === 'edit') {
        document.getElementById('nameCategoryInput').value = data.name;
        document.getElementById('categoryModalTitle').textContent = 'Editar categoría';
        document.getElementById('saveCategoryBtn').textContent = 'Actualizar';
    }

    const modalElement = document.getElementById('modal');
    const modal = mdb.Modal.getOrCreateInstance(modalElement);
    modal.show();
};