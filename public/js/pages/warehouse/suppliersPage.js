import { createSupplierDatatable } from "../../plugins/datatable/supplierDatatable.js";
import { useForm } from "../../application/form.js";
import { editSupplier, registerSupplier } from "../../application/warehouse/suppliers.js";
import { supplierValidators } from "../../core/validations/validators.js";
import { handleSuccess, validateFields } from "../../utils/formUtils.js";

createSupplierDatatable();

useForm({
    normalizeData: ({ formData }) => {
        formData.isActive = document.getElementById('isActiveInput').checked;
    },
    getErrors: (formData) => {
        
        let errors = {};

        errors = validateFields(supplierValidators, formData);

        return errors;
    },
    sendRequest: async ({ formData, form }) => {

        await handleSuccess({
            form,
            formData,
            create: registerSupplier,
            update: editSupplier,
        });
    }
});