import { createProductDatatable } from "../../plugins/datatable/productDatatable.js";
import { useForm } from "../../application/form.js";
import { editProduct, registerProduct } from "../../application/warehouse/products.js";
import { productValidators } from "../../core/validations/validators.js";
import { handleSuccess, validateFields } from "../../utils/formUtils.js";
import { toggleInputSelectErrors } from "../../ui/forms/formMessagesUI.js";

createProductDatatable();

useForm({
    normalizeData: ({ formData }) => {
        formData.isActive = document.getElementById('isActiveInput').checked;
    },
    getErrors: (formData) => {
        
        let errors = {};

        errors = validateFields(productValidators, formData);

        if (!errors.minStock && formData.minStock > formData.maxStock) errors.minStock = 'El stock mínimo no debe ser mayor al stock máximo';

        return errors;
    },
    normalizeErrors: (form, errors) => toggleInputSelectErrors(form, errors),
    sendRequest: async ({ formData, form }) => {

        await handleSuccess({
            form,
            formData,
            create: registerProduct,
            update: editProduct
        });
    },
    normalizeServerErrors: (form, serverErrors) => toggleInputSelectErrors(form, serverErrors)
});