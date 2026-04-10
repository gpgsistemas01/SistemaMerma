import { useForm } from "../../application/form.js";
import { approveGoodsIssue, cancelGoodsIssue, confirmGoodsIssue, editGoodsIssue, registerGoodsIssue, rejectGoodsIssue } from "../../application/warehouse/goodsIssues.js";import { validateGoodsIssueValidators } from "../../core/validations/validators.js";
import { refreshProductTable } from "../../plugins/datatable/baseDatatable.js";
import { createGoodsIssueDatatable, details, initDetailsGoodsIssueTable } from "../../plugins/datatable/goodsIssueDatatable.js";
import { initGoodsIssueSelect2 } from "../../plugins/select2/goodsIssueSelect.js";
import { toggleInputSelectErrors, toggleTableErrors, setFormReadOnly, toggleButtons } from "../../ui/formUI.js";
import { on } from "../../utils/domUtils.js";
import { formatDateLongWithTime } from "../../utils/formatters.js";
import { handleAction, handleSubmit, validateFields } from "../../utils/formUtils.js";

const context = window.GOODS_ISSUE_CONTEXT || {};
let leftAction = null;
let rightAction = null;

const buildDeliveredByProductMap = (movement = []) => {

    return movement.reduce((acc, entry) => {
        (entry.details || []).forEach((detail) => {
            const current = acc.get(detail.productId) || 0;
            acc.set(detail.productId, current + Number(detail.quantity || 0));
        });
        return acc;
    }, new Map());
};

createGoodsIssueDatatable(context);

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

        await handleSubmit({
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

export const openGoodsIssueModal = async ({ mode, data = null }) => {

    const form = document.getElementById('form');

    form.dataset.mode = mode;
    form.dataset.id = data?.id || '';

    toggleButtons({ mode, status: data?.status?.name, showActions: false });
    setFormReadOnly({ form, isReadOnly: false });

    leftAction = null;
    rightAction = null;
    details.length = 0;

    if (mode === 'create') {

        form.reset();
        document.getElementById('modalTitle').textContent = 'Registrar salida';
        document.getElementById('submitBtn').textContent = 'Guardar';
        document.getElementById('uomDisplayInput').value = '';

        await initGoodsIssueSelect2({ context });
    }

    if (mode === 'edit' || mode === 'view') {

        const deliveredByProduct = buildDeliveredByProductMap(data?.movement || []);

        document.getElementById('observationsInput').value = data.observations || '';
        document.getElementById('requestDateInput').value = formatDateLongWithTime(data.requestDate);
        details.push(...(data?.details || [])
            .map(detail => ({
                deliveredQuantity: Math.min(Number(detail.quantity), deliveredByProduct.get(detail.product.id) || 0),
                id: detail.id,
                name: detail.product.name,
                productId: detail.product.id,
                quantity: detail.quantity,
                pendingQuantity: Math.max(
                    Number(detail.quantity) - Math.min(Number(detail.quantity), deliveredByProduct.get(detail.product.id) || 0),
                    0
                ),
                description: detail.description,
                uom: detail.product.uom?.name || 'N/A'
            }))
            .map((detail) => {
                const delivered = detail.deliveredQuantity || 0;
                const currentDeliveredByProduct = deliveredByProduct.get(detail.productId) || 0;
                deliveredByProduct.set(detail.productId, Math.max(currentDeliveredByProduct - delivered, 0));
                return detail;
            })
        );

        await initGoodsIssueSelect2({ data, context });

        if (mode === 'edit') {
            document.getElementById('modalTitle').textContent = 'Editar salida';
            document.getElementById('submitBtn').textContent = 'Actualizar';
        }

        if (mode === 'view') {
            document.getElementById('modalTitle').textContent = 'Ver salida';
            setFormReadOnly({ form, isReadOnly: true });
        }
    }

    if (mode === 'view' && data?.status?.name) {

        const isAdmin = context.role === 'Administrador del sistema';
        const isWarehouse = context.department === 'Almacén';
        const isCoordinatorOfArea = context.role === 'Coordinador' && data?.department?.name === context.department;
        const status = data.status.name;

        const canApproveReject = status === 'Abierta' && (isAdmin || isWarehouse || isCoordinatorOfArea);
        const canConfirmCancel = status === 'Aprobada' && (isAdmin || isWarehouse);

        const actionContainer = document.querySelector('.approve-container');
        const cancelBtn = document.getElementById('cancelBtn');
        const confirmBtn = document.getElementById('confirmBtn');

        if (canApproveReject) {

            actionContainer.classList.remove('d-none');
            cancelBtn.textContent = 'Rechazar';
            confirmBtn.textContent = 'Aprobar';
            leftAction = rejectGoodsIssue;
            rightAction = approveGoodsIssue;

        } else if (canConfirmCancel) {

            actionContainer.classList.remove('d-none');
            cancelBtn.textContent = 'Cancelar';
            confirmBtn.textContent = 'Confirmar';
            leftAction = cancelGoodsIssue;
            rightAction = confirmGoodsIssue;

        } else {

            actionContainer.classList.add('d-none');
        }
    }

    initDetailsGoodsIssueTable(mode, data?.status?.name);

    const modalElement = document.getElementById('modal');
    const modal = mdb.Modal.getOrCreateInstance(modalElement);
    modal.show();
};

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

    details.push({ productId, name: productName, quantity, description, uom: selectedProduct?.uom || 'N/A' });

    refreshProductTable(details);

    $('#productInput').empty().trigger('change');
    document.getElementById('quantityInput').value = '';
    document.getElementById('descriptionInput').value = '';
    document.getElementById('uomDisplayInput').value = '';
};

on('click', '#addProductBtn', addProduct);
on('click', '#cancelBtn', async () => {
    if (!leftAction) return;
    await handleAction(leftAction);
});
on('click', '#confirmBtn', async () => {
    if (!rightAction) return;
    await handleAction(rightAction);
});