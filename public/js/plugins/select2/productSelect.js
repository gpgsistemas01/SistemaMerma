import { initbaseSelect2 } from "./baseSelect.js";

export const initProductSelect2 = async (data = null) => {

    initbaseSelect2({
        selector: '#categoryProductInput',
        url: '/api/warehouse/categories/',
        placeholder: 'Buscar categoría...',
        processResults: (data) => {
            
            const list = data.data || data;
            return { 
                results: list.map(category => ({ 
                    id: category.id, 
                    text: category.name 
                })) 
            }; 
        }
    });

    initbaseSelect2({
        selector: '#uomProductInput',
        url: '/api/warehouse/uoms/',
        placeholder: 'Buscar unidad de medida...',
        processResults: (data) => {
            
            const list = data.data || data;
            return { 
                results: list.map(uom => ({ 
                    id: uom.id, 
                    text: uom.name 
                })) 
            }; 
        }
    });

    if (data) {

        const option = new Option(data.uom.name, data.uom.id, true, true);
        $('#uomProductInput').append(option).trigger('change');
        const categoryOption = new Option(data.category.name, data.category.id, true, true);
        $('#categoryProductInput').append(categoryOption).trigger('change');

    } else {

        $('#categoryProductInput').empty().trigger('change');
        $('#uomProductInput').empty().trigger('change');
    }
}