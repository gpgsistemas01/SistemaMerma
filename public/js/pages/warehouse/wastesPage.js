import { useForm } from "../../application/form.js";
import { editWaste, registerWaste } from "../../application/warehouse/wastes.js";
import { createWasteDatatable } from "../../plugins/datatable/wasteDatatable.js";
import { initWasteSelect2, setWasteSelectOptions } from "../../plugins/select2/modules/wasteSelect.js";
import { clearFormErrors, initForm, toggleFormFields } from "../../ui/formUI.js";
import { openModal } from "../../ui/modalUI.js";
import { handleSubmit, validateFields } from "../../utils/formUtils.js";
import { wasteDataValidators, wasteValidators } from "../../utils/validations/validators.js";

const context = window.meta || {};

createWasteDatatable(context);

const wasteModalId = '#wasteModal';
const formId = '#wasteForm';
const stockAdjustmentFields = ['reasonId', 'observations'];

const setWasteValues = ({ form, data = null }) => {

    form.elements.base.value = data?.base || '';
    form.elements.height.value = data?.height || '';
    form.elements.quantity.value = data?.quantity || data?.currentStock || '';
    form.elements.observations.value = data?.observations || '';
};

export const openWasteModal = ({
    mode = 'create',
    data = null
} = {}) => {

    const form = document.querySelector(formId);
    const modalElement = document.querySelector(wasteModalId);

    initForm({ form, mode, id: mode === 'edit' ? data?.id : '' });
    initWasteSelect2({ modalSelector: wasteModalId });
    setWasteSelectOptions({ modalSelector: wasteModalId, data });
    setWasteValues({ form, data: mode === 'edit' ? data : null });
    toggleFormFields({
        form,
        fields: stockAdjustmentFields,
        isVisible: mode !== 'edit'
    });
    clearFormErrors(form);

    modalElement.querySelector('#modalTitle').textContent = mode === 'edit'
        ? 'Editar merma'
        : 'Registrar merma';
    form.querySelector('#submitBtn').textContent = mode === 'edit'
        ? 'Actualizar'
        : 'Guardar';

    openModal(modalElement);
};

useForm({
    selector: formId,
    getErrors: ({ form, formData }) => validateFields(
        form.dataset.mode === 'edit' ? wasteDataValidators : wasteValidators,
        formData
    ),
    sendRequest: async ({ formData, form }) => {

        await handleSubmit({
            form,
            formData,
            create: registerWaste,
            update: editWaste
        });
    }
});
