import { ADVISORS_API_ROUTE } from "../../../services/sales/advisorService.js";
import { initbaseSelect2, toggleSelectOption } from "../baseSelect.js";

export const initAdvisorSelect = ({ 
    modalSelector, 
    baseSelector, 
    allowCreate = true
}) => {

    initbaseSelect2({
        baseSelector,
        modalSelector,
        url: ADVISORS_API_ROUTE,
        placeholder: 'Buscar asesor...',
        processResults: (data) => {

            const list = data.data || data;

            return {
                results: list.map(a => ({
                    id: a.id,
                    text: a.name,
                }))
            };
        },
        ...(allowCreate && {
            tags: true,
            createTag: (params) => {

                const term = params.term.trim();

                if (!term) return null;

                return {
                    id: `new:${ term }`,
                    text: `${ term } (Nuevo asesor)`,
                    newTag: true
                };
            }
        })
    });
};

export const toggleAdvisorOption = ({ 
    selector, 
    id = null, 
    name = null
}) => toggleSelectOption({
    selector,
    data: {
        id,
        text: name
    }
});