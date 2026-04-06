import { useForm } from "../../application/form.js";
import { editPurchaseRequisition, registerPurchaseRequisition } from "../../application/warehouse/purchaseRequisitions.js";
import { validatePurchaseRequisitionValidators } from "../../core/validations/validators.js";
import { createPurchaseRequisitionDatatable, details } from "../../plugins/datatable/purchaseRequisitionDatatable.js";
import { toggleInputSelectErrors, toggleTableErrors } from "../../ui/forms/formMessagesUI.js";
import { handleSuccess, validateFields } from "../../utils/formUtils.js";

createPurchaseRequisitionDatatable();

useForm({
    normalizeData: ({ formData }) => {

        formData.details = details;
    },
    getErrors: (formData) => {

        let errors = {};

        errors = validateFields(validatePurchaseRequisitionValidators, formData);

        return errors;
    },
    normalizeErrors: ({ form, errors }) => {

        toggleTableErrors(form, errors);
        toggleInputSelectErrors(form, errors);
    },
    sendRequest: async ({ formData, form }) => {

        await handleSuccess({
            form,
            formData,
            create: registerPurchaseRequisition,
            update: editPurchaseRequisition
        });
    },
    normalizeServerErrors: (form, serverErrors) => {

        toggleTableErrors(form, serverErrors);
        toggleInputSelectErrors(form, serverErrors);
    }
});
