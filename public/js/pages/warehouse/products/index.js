import { createProductDatatable } from "../../../plugins/datatable/productDatatable.js";
import { useForm } from "../../../application/form.js";
import { editProduct, registerProduct } from "../../../application/warehouse/products.js";
import { validators } from "../../../core/validations/validators.js";
import { hadnleSuccess } from "../../../utils/formUtils.js";

createProductDatatable('productTable');

useForm({
    selector: '#productForm',
    getErrors: (formData) => {
        
        const errors = {};

        errors.name = validators.name(formData.name);

        return errors;
    },
    sendRequest: async ({ formData, form }) => {

        hadnleSuccess({
            form,
            formData,
            create: registerProduct,
            update: editProduct,
            tableId: '#productTable'
        });
    }
});