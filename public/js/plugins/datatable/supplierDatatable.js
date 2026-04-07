import { openSupplierModal } from "../../pages/warehouse/suppliersPage.js";
import { createDataTable } from "./baseDatatable.js";

const selectorTable = '#table';

export const createSupplierDatatable = () => {
    
    const table = createDataTable({
            options: {
            ajax: '/api/warehouse/suppliers/',
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