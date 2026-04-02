import { createSupplierDatatable } from "../../../plugins/datatable/supplierDatatable.js";
import { useForm } from "../../../application/form.js";
import { editSupplier, registerSupplier } from "../../../application/warehouse/suppliers.js";
import { validators } from "../../../core/validations/validators.js";
import { hadnleSuccess } from "../../../utils/formUtils.js";

createSupplierDatatable('supplierTable');

useForm({
    selector: '#supplierForm',
    normalizeData: (form, formData) => {
        formData.isActive = document.getElementById('isActiveSupplierInput').checked;
    },
    getErrors: (formData) => {
        
        const errors = {};

        errors.name = validators.name(formData.name);
        errors.numberphone = validators.numberphone(formData.numberphone);

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