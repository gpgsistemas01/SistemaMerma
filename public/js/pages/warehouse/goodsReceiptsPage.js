import { useForm } from "../../application/form.js";
import { cancelGoodsReceipt, confirmGoodsReceipt, editGoodsReceipt, registerGoodsReceipt } from "../../application/warehouse/goodsReceipts.js";
import { validateGoodsReceiptValidators } from "../../core/validations/validators.js";
import { refreshProductTable } from "../../plugins/datatable/baseDatatable.js";
import { createGoodsReceiptDatatable, details, initDetailsGoodsReceiptTable } from "../../plugins/datatable/goodsReceiptDatatable.js";
import { initGoodsReceiptSelect2 } from "../../plugins/select2/goodsReceiptSelect.js";
import { toggleInputSelectErrors, toggleTableErrors, setFormReadOnly, toggleButtons } from "../../ui/formUI.js";
import { on } from "../../utils/domUtils.js";
import { formatDateLongWithTime } from "../../utils/formatters.js";
import { handleAction, handleSubmit, validateFields } from "../../utils/formUtils.js";

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

        await handleSubmit({
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
});

export const openGoodsReceiptModal = async ({ mode, data = null }) => {

    const form = document.getElementById('form');

    form.dataset.mode = mode;
    form.dataset.id = data?.id || '';

    toggleButtons({ mode, status: data?.status?.name });
    setFormReadOnly({ form, isReadOnly: false });

    details.length = 0;

    if (mode === 'create') {
        
        form.reset();
        document.getElementById('modalTitle').textContent = 'Registrar recepción';
        document.getElementById('submitBtn').textContent = 'Guardar';
        document.getElementById('uomDisplayInput').value = '';

        await initGoodsReceiptSelect2();
    }

    if (mode === 'edit' || mode === 'view') {

        document.getElementById('observationsInput').value = data.observations || '';
        document.getElementById('receptionDateInput').value = formatDateLongWithTime(data.receptionDate);
        details.push(...data?.details.map(detail => ({
            id: detail.id,
            name: detail.product.name,
            productId: detail.product.id,
            quantity: detail.quantity,
            description: detail.description,
            uom: detail.product.uom?.name || 'N/A'
        })));

        await initGoodsReceiptSelect2(data);

        if (mode === 'edit') {

            document.getElementById('modalTitle').textContent = 'Editar recepción';
            document.getElementById('submitBtn').textContent = 'Actualizar';
        }

        if (mode === 'view') {

            document.getElementById('modalTitle').textContent = 'Ver recepción';

            setFormReadOnly({ form, isReadOnly: true });
        }
    }

    initDetailsGoodsReceiptTable(mode)

    const modalElement = document.getElementById('modal');
    const modal = mdb.Modal.getOrCreateInstance(modalElement);
    modal.show();
}

const addProduct = () => {

    const productId = document.getElementById('productInput').value;
    const selectedProduct = $('#productInput').select2('data')?.[0];
    const productName = selectedProduct?.text || '';
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

    const product = { productId: productId, name: productName, quantity, description, uom: selectedProduct?.uom || 'N/A' };
    details.push(product);

    refreshProductTable(details);

    $('#productInput').empty().trigger('change');
    document.getElementById('quantityInput').value = '';
    document.getElementById('descriptionInput').value = '';
    document.getElementById('uomDisplayInput').value = '';
}

on('click', '#addProductBtn', addProduct);
on('click', '#cancelBtn', async () => await handleAction(cancelGoodsReceipt));
on('click', '#confirmBtn', async () => await handleAction(confirmGoodsReceipt));
on('change', '#productInput', () => {
    const selectedProduct = $('#productInput').select2('data')?.[0];
    document.getElementById('uomDisplayInput').value = selectedProduct?.uom || '';
});