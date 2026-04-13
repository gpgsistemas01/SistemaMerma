import { openProductModal } from "../../pages/warehouse/productsPage.js";
import { createDataTable } from "./baseDatatable.js";
import { notifications } from "../swal/swalComponent.js";

const selectorTable = '#table';
let lastLowStockNotification = '';
let stockSocketConfigured = false;

const configureStockRealtime = (table) => {

    if (stockSocketConfigured) return;

    stockSocketConfigured = true;

    window.addEventListener('stock:updated', () => {
        table.ajax.reload(null, false);
    });
};

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
            createdRow: (row, data) => {

                if (Number(data.currentStock) < Number(data.minStock)) {
                    row.classList.add('table-warning');
                }
            },
            drawCallback: function() {

                const currentData = this.api().rows({ page: 'current' }).data().toArray();
                const lowStockProducts = currentData.filter((product) => Number(product.currentStock) < Number(product.minStock));

                if (!lowStockProducts.length) {
                    lastLowStockNotification = '';
                    return;
                }

                const lowStockSignature = lowStockProducts.map((product) => product.id).join(',');

                if (lastLowStockNotification === lowStockSignature) return;

                lastLowStockNotification = lowStockSignature;

                const productNames = lowStockProducts
                    .slice(0, 3)
                    .map((product) => product.name)
                    .join(', ');

                notifications.showWarning(
                    `Hay ${lowStockProducts.length} producto(s) por debajo del stock mínimo: ${productNames}${lowStockProducts.length > 3 ? '...' : ''}`
                );
            },
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

    configureStockRealtime(table);

    $(`${ selectorTable } tbody`).on('click', '.btn-edit', async function() {

        const data = table.row($(this).closest('tr')).data();

        await openProductModal({ mode: 'edit', data });
    });

    $(`${ selectorTable } tbody`).on('click', '.btn-view', function() {

        const data = table.row($(this).closest('tr')).data();

        openProductModal({ mode: 'view', data });
    });
}
