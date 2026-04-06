import { initbaseSelect2 } from "./baseSelect.js";

export const initGoodsReceiptSelect2 = async (data = null) => {

    const supplierSelector = '#supplierInput';
    const receivedBySelector = '#receivedByInput';
    const productSelector = '#productInput';

    initbaseSelect2({
        selector: supplierSelector,
        url: '/api/warehouse/suppliers/',
        placeholder: 'Buscar proveedor...',
        processResults: (data) => {
            
            const list = data.data || data;
            return { 
                results: list.map(supplier => ({ 
                    id: supplier.id, 
                    text: supplier.name 
                })) 
            }; 
        }
    });

    initbaseSelect2({
        selector: receivedBySelector,
        url: '/api/admin/profiles?department=Almacén',
        placeholder: 'Buscar persona que recibe...',
        processResults: (data) => {
            
            const list = data.data || data;
            return { 
                results: list.map(receivedBy => ({ 
                    id: receivedBy.id, 
                    text: `${ receivedBy.name } ${ receivedBy.lastName }`
                })) 
            }; 
        }
    });

    initbaseSelect2({
        selector: productSelector,
        url: '/api/warehouse/products/',
        placeholder: 'Buscar producto...',
        processResults: (data) => {

            const list = data.data || data;
            return { 
                results: list.map(product => ({
                    id: product.id,
                    text: product.name
                })) 
            }; 
        }
    });

    if (data) {

        const supplierOption = new Option(data.supplier.name, data.supplier.id, true, true);
        $(supplierSelector).append(supplierOption).trigger('change');
        const receivedByOption = new Option(data.receivedBy.name, data.receivedBy.id, true, true);
        $(receivedBySelector).append(receivedByOption).trigger('change');

    } else {

        $(supplierSelector).empty().trigger('change');
        $(receivedBySelector).empty().trigger('change');
    }
}