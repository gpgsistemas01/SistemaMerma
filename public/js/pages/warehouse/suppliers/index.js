import { createSupplierDatatable } from "../../../plugins/datatable/supplierDatatable.js";
import { useForm } from "../../../application/form.js";
import { editSupplier, registerSupplier } from "../../../application/warehouse/suppliers.js";
import { supplierValidators } from "../../../core/validations/validators.js";
import { hadnleSuccess, validateFields } from "../../../utils/formUtils.js";

createSupplierDatatable('supplierTable');

useForm({
    selector: '#supplierForm',
    normalizeData: ({ formData }) => {
        formData.isActive = document.getElementById('isActiveSupplierInput').checked;
    },
    getErrors: (formData) => {
        
        let errors = {};

        errors = validateFields(supplierValidators, formData);

        return errors;
    },
    sendRequest: async ({ formData, form }) => {

        hadnleSuccess({
            form,
            formData,
            create: registerSupplier,
            update: editSupplier,
            tableId: '#supplierTable'
        });
    }
});