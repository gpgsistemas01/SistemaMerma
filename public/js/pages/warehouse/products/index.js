import { createProductDatatable } from "../../../plugins/datatable/productDatatable.js";
import { useForm } from "../../../application/form.js";
import { editProduct, registerProduct } from "../../../application/warehouse/products.js";
import { productValidators } from "../../../core/validations/validators.js";
import { hadnleSuccess, validateFields } from "../../../utils/formUtils.js";
import { toggleInputSelectErrors } from "../../../ui/forms/formMessagesUI.js";

createProductDatatable('productTable');

useForm({
    selector: '#productForm',
    normalizeData: ({ formData }) => {
        formData.isActive = document.getElementById('isActiveProductInput').checked;
    },
    getErrors: (formData) => {
        
        let errors = {};

        errors = validateFields(productValidators, formData);

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
    },
    normalizeServerErrors: (form, serverErrors) => toggleInputSelectErrors(form, serverErrors)
});