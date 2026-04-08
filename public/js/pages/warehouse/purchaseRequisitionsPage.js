import { useForm } from "../../application/form.js";
import { cancelPurchaseRequisition, confirmPurchaseRequisition, editPurchaseRequisition, registerPurchaseRequisition } from "../../application/warehouse/purchaseRequisitions.js";
import { validatePurchaseRequisitionValidators } from "../../core/validations/validators.js";
import { refreshProductTable } from "../../plugins/datatable/baseDatatable.js";
import { createPurchaseRequisitionDatatable, details, initDetailsPurchaseRequisitionTable } from "../../plugins/datatable/purchaseRequisitionDatatable.js";
import { initPurchaseRequisitionSelect2 } from "../../plugins/select2/purchaseRequisitionSelect.js";
import { toggleInputSelectErrors, toggleTableErrors, setFormReadOnly, toggleButtons } from "../../ui/formUI.js";
import { on } from "../../utils/domUtils.js";
import { formatDateLongWithTime } from "../../utils/formatters.js";
import { handleAction, handleSubmit, validateFields } from "../../utils/formUtils.js";

const context = window.PURCHASE_REQUISITION_CONTEXT || {};

createPurchaseRequisitionDatatable(context);

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

        await handleSubmit({
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

export const openPurchaseRequisitionModal = async ({ mode, data = null }) => {

    const form = document.getElementById('form');

    form.dataset.mode = mode;
    form.dataset.id = data?.id || '';

    toggleButtons({ mode, status: data?.status?.name });
    setFormReadOnly({ form, isReadOnly: false });

    details.length = 0;

    if (mode === 'create') {

        form.reset();
        document.getElementById('modalTitle').textContent = 'Registrar requisición';
        document.getElementById('submitBtn').textContent = 'Guardar';

        await initPurchaseRequisitionSelect2();
    }

    if (mode === 'edit' || mode === 'view') {

        document.getElementById('observationsInput').value = data.observations || '';
        document.getElementById('requestDateInput').value = formatDateLongWithTime(data.requestDate);
        details.push(...data?.details.map(detail => ({
            id: detail.id,
            name: detail.product.name,
            productId: detail.product.id,
            quantity: detail.quantity,
            description: detail.description
        })));

        await initPurchaseRequisitionSelect2(data);

        if (mode === 'edit') {

            document.getElementById('modalTitle').textContent = 'Editar requisición';
            document.getElementById('submitBtn').textContent = 'Actualizar';
        }

        if (mode === 'view') {

            document.getElementById('modalTitle').textContent = 'Ver requisición';

            setFormReadOnly({ form, isReadOnly: true });
        }
    }

    initDetailsPurchaseRequisitionTable(mode);

    const modalElement = document.getElementById('modal');
    const modal = mdb.Modal.getOrCreateInstance(modalElement);
    modal.show();
};

const addProduct = () => {

    const productId = document.getElementById('productInput').value;
    const productName = document.getElementById('productInput').selectedOptions?.[0]?.text || '';
    const quantity = document.getElementById('quantityInput').value;
    const description = document.getElementById('descriptionInput').value;

    if (!productId || !quantity) {
        alert('Por favor, complete los campos de producto y cantidad.');
        return;
    }

    if (isNaN(quantity) || parseFloat(quantity) < 1) {
        alert('La cantidad debe ser un número mayor a cero.');
        return;
    }

    if (description && description.trim().length > 50) {
        alert('La descripción debe tener como máximo 50 caracteres.');
        return;
    }

    const product = { productId, name: productName, quantity, description };
    details.push(product);

    refreshProductTable(details);

    $('#productInput').empty().trigger('change');
    document.getElementById('quantityInput').value = '';
    document.getElementById('descriptionInput').value = '';
};

on('click', '#addProductBtn', addProduct);
on('click', '#cancelBtn', async ()=> await handleAction(cancelPurchaseRequisition));
on('click', '#confirmBtn', async () => await handleAction(confirmPurchaseRequisition));