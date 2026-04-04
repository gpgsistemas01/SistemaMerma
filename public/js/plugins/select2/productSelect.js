import { initbaseSelect2 } from "./baseSelect.js";

export const initProductSelect2 = async (data = null) => {

    const categorySelector = '#categoryInput';
    const uomSelect = '#uomInput';

    initbaseSelect2({
        selector: categorySelector,
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
        selector: uomSelect,
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
        $(uomSelect).append(option).trigger('change');
        const categoryOption = new Option(data.category.name, data.category.id, true, true);
        $(categorySelector).append(categoryOption).trigger('change');

    } else {

        $(categorySelector).empty().trigger('change');
        $(uomSelect).empty().trigger('change');
    }
}