import { useForm } from "../../application/form.js";
import { editGoodsReceipt, registerGoodsReceipt } from "../../application/warehouse/goodsReceipts.js";
import { validateGoodsReceiptValidators } from "../../core/validations/validators.js";
import { createGoodsReceiptDatatable, details } from "../../plugins/datatable/goodsReceiptDatatable.js";
import { toggleInputSelectErrors, toggleTableErrors } from "../../ui/forms/formMessagesUI.js";
import { handleSuccess, validateFields } from "../../utils/formUtils.js";

createGoodsReceiptDatatable();

useForm({
    normalizeData: ({ formData }) => {

        formData.details = details;
    },
    getErrors: (formData) => {
        
        let errors = {};

        errors = validateFields(validateGoodsReceiptValidators, formData);

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
            create: registerGoodsReceipt,
            update: editGoodsReceipt
        });
    },
    normalizeServerErrors: (form, serverErrors) => {
        
        toggleTableErrors(form, serverErrors);
        toggleInputSelectErrors(form, serverErrors);
    }
})