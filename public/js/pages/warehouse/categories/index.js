import { createCategoryDatatable } from "../../../plugins/datatable/categoryDatatable.js";
import { useForm } from "../../../application/form.js";
import { editCategory, registerCategory } from "../../../application/warehouse/categories.js";
import { validators } from "../../../core/validations/validators.js";
import { hadnleSuccess } from "../../../utils/formUtils.js";

createCategoryDatatable('categoryTable');

useForm({
    selector: '#categoryForm',
    getErrors: (formData) => {
        
        const errors = {};

        errors.name = validators.name(formData.name);

        return errors;
    },
    sendRequest: async ({ formData, form }) => {

        hadnleSuccess({
            form,
            formData,
            create: registerCategory,
            update: editCategory,
            tableId: '#categoryTable'
        });
    }
});