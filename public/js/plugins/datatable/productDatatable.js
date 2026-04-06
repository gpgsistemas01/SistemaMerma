import { setFormReadOnly } from "../../utils/formUtils.js";
import { initProductSelect2 } from "../select2/productSelect.js";
import { createDataTable } from "./baseDatatable.js";

const selectorTable = '#table';

export const createProductDatatable = () => {
    
    const table = createDataTable({
        options: {
            ajax: '/api/warehouse/products',
            columns: [
                { data: 'name', title: 'Nombre' },
                { 
                    data: null,
                    render: (data, type, row) => (row.base && row.height) ? `${row.base} x ${row.height}` : 'N/A'
                },
                { data: 'unitCost', title: 'Costo Unitario' },
                { data: 'currentStock', title: 'Stock actual' },
                { data: 'minStock', title: 'Stock mínimo' },
                { data: 'maxStock', title: 'Stock máximo' },
                { 
                    data: 'expiryDate',
                    title: 'Fecha de Caducidad',
                    render: (data) => data ? new Date(data).toLocaleDateString() : 'N/A'
                },
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
                    text: 'Nuevo producto',
                    action: () => {
                        openProductModal({ mode: 'create' });
                    }
                }
            ]
        }
    });

    $(`${ selectorTable } tbody`).on('click', '.btn-edit', async function() {

        const data = table.row($(this).closest('tr')).data();

        await openProductModal({ mode: 'edit', data });
    });

    $(`${ selectorTable } tbody`).on('click', '.btn-view', function() {

        const data = table.row($(this).closest('tr')).data();

        openProductModal({ mode: 'view', data });
    });
}

const openProductModal = async ({ mode, data = null }) => {
    
    const form = document.getElementById('form');

    form.dataset.mode = mode;
    form.dataset.id = data?.id || '';

    setFormReadOnly({ form, isReadOnly: false });

    if (mode === 'create') {
        
        form.reset();
        document.getElementById('modalTitle').textContent = 'Registrar producto';
        document.getElementById('submitBtn').textContent = 'Guardar';

        await initProductSelect2();
    }

    if (mode === 'edit' || mode === 'view') {

        document.getElementById('nameInput').value = data.name;
        document.getElementById('unitCostInput').value = data.unitCost;
        document.getElementById('minStockInput').value = data.minStock;
        document.getElementById('maxStockInput').value = data.maxStock;
        document.getElementById('expiryDateInput').value = data.expiryDate ? new Date(data.expiryDate) : '';
        document.getElementById('thicknessInput').value = data.thickness || '';
        document.getElementById('baseInput').value = data.base || '';
        document.getElementById('heightInput').value = data.height || '';
        document.getElementById('colorInput').value = data.color || '';
        document.getElementById('typeInput').value = data.type || '';
        document.getElementById('presentationInput').value = data.presentation || '';
        document.getElementById('isActiveInput').checked = data.isActive;

        await initProductSelect2(data);

        if (mode === 'edit') {

            document.getElementById('modalTitle').textContent = 'Editar producto';
            document.getElementById('submitBtn').textContent = 'Actualizar';
        }

        if (mode === 'view') {

            document.getElementById('modalTitle').textContent = 'Ver producto';

            setFormReadOnly({ form, isReadOnly: true });
        }


    }

    const modalElement = document.getElementById('modal');
    const modal = mdb.Modal.getOrCreateInstance(modalElement);
    modal.show();
}