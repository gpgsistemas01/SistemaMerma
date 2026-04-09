import { openProductModal } from "../../pages/warehouse/productsPage.js";
import { createDataTable } from "./baseDatatable.js";

const selectorTable = '#table';

export const createProductDatatable = () => {
    
    const table = createDataTable({
        options: {
            ajax: '/api/warehouse/products/',
            columns: [
                { data: 'name', title: 'Nombre' },
                { 
                    data: null,
                    title: 'Dimensiones (Base x Altura)',
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