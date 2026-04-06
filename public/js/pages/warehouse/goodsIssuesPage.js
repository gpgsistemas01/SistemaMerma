import { useForm } from "../../application/form.js";
import { editGoodsIssue, registerGoodsIssue } from "../../application/warehouse/goodsIssues.js";
import { validateGoodsIssueValidators } from "../../core/validations/validators.js";
import { createGoodsIssueDatatable, details } from "../../plugins/datatable/goodsIssueDatatable.js";
import { toggleInputSelectErrors, toggleTableErrors } from "../../ui/forms/formMessagesUI.js";
import { handleSuccess, validateFields } from "../../utils/formUtils.js";

createGoodsIssueDatatable();

useForm({
    normalizeData: ({ formData }) => {

        formData.details = details;
    },
    getErrors: (formData) => {

        let errors = {};

        errors = validateFields(validateGoodsIssueValidators, formData);

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
            create: registerGoodsIssue,
            update: editGoodsIssue
        });
    },
    normalizeServerErrors: (form, serverErrors) => {

        toggleTableErrors(form, serverErrors);
        toggleInputSelectErrors(form, serverErrors);
    }
});
