import { useForm } from "../../application/form.js";
import { editProductConsumption, registerProductConsumption } from "../../application/warehouse/productConsumptions.js";
import { validateProductConsumptionValidators } from "../../core/validations/validators.js";
import { refreshProductTable } from "../../plugins/datatable/baseDatatable.js";
import { createProductConsumptionDatatable, details, initDetailsProductConsumptionTable } from "../../plugins/datatable/productConsumptionDatatable.js";
import { initProductConsumptionSelect2 } from "../../plugins/select2/productConsumptionSelect.js";
import { setFormReadOnly, toggleInputSelectErrors, toggleTableErrors } from "../../ui/formUI.js";
import { on } from "../../utils/domUtils.js";
import { formatDateLongWithTime } from "../../utils/formatters.js";
import { handleSubmit, validateFields } from "../../utils/formUtils.js";

createProductConsumptionDatatable();

useForm({
    normalizeData: ({ formData }) => {
        formData.details = details;
    },
    getErrors: (formData) => validateFields(validateProductConsumptionValidators, formData),
    normalizeErrors: ({ form, errors }) => {
        toggleTableErrors(form, errors);
        toggleInputSelectErrors(form, errors);
    },
    sendRequest: async ({ formData, form }) => {
        await handleSubmit({ form, formData, create: registerProductConsumption, update: editProductConsumption });
    },
    normalizeServerErrors: (form, serverErrors) => {
        toggleTableErrors(form, serverErrors);
        toggleInputSelectErrors(form, serverErrors);
    }
});

export const openProductConsumptionModal = async ({ mode, data = null }) => {
    const form = document.getElementById('form');
    form.dataset.mode = mode;
    form.dataset.id = data?.id || '';

    document.querySelector('.add-product-container').classList.toggle('d-none', mode === 'view');
    setFormReadOnly({ form, isReadOnly: false });

    details.length = 0;

    if (mode === 'create') {
        form.reset();
        document.getElementById('modalTitle').textContent = 'Registrar consumo de producto';
        document.getElementById('submitBtn').textContent = 'Guardar';
        await initProductConsumptionSelect2();
    }

    if (mode === 'edit' || mode === 'view') {
        document.getElementById('requestDateInput').value = formatDateLongWithTime(data.requestDate);
        details.push(...data.details.map(detail => ({
            id: detail.id,
            productId: detail.product.id,
            name: detail.product.name,
            goodsIssueId: detail.goodsIssue.id,
            goodsIssueReferenceNumber: detail.goodsIssue.referenceNumber,
            consumedSquareMeters: detail.consumedSquareMeters
        })));

        await initProductConsumptionSelect2(data);

        if (mode === 'edit') {
            document.getElementById('modalTitle').textContent = 'Editar consumo de producto';
            document.getElementById('submitBtn').textContent = 'Actualizar';
        }

        if (mode === 'view') {
            document.getElementById('modalTitle').textContent = 'Ver consumo de producto';
            setFormReadOnly({ form, isReadOnly: true });
        }
    }

    initDetailsProductConsumptionTable(mode);
    mdb.Modal.getOrCreateInstance(document.getElementById('modal')).show();
};

const addProduct = () => {
    const productId = document.getElementById('productInput').value;
    const productName = document.getElementById('productInput').selectedOptions?.[0]?.text || '';
    const goodsIssueId = document.getElementById('goodsIssueInput').value;
    const goodsIssueReferenceNumber = document.getElementById('goodsIssueInput').selectedOptions?.[0]?.text || '';
    const consumedSquareMeters = document.getElementById('consumedSquareMetersInput').value;

    if (!productId || !goodsIssueId || !consumedSquareMeters) {
        alert('Por favor complete producto, salida y m² consumidos.');
        return;
    }

    if (isNaN(consumedSquareMeters) || parseFloat(consumedSquareMeters) < 1) {
        alert('Los m² consumidos deben ser un número mayor a cero.');
        return;
    }

    details.push({ productId, name: productName, goodsIssueId, goodsIssueReferenceNumber, consumedSquareMeters });
    refreshProductTable(details);

    $('#productInput').empty().trigger('change');
    $('#goodsIssueInput').empty().trigger('change');
    document.getElementById('consumedSquareMetersInput').value = '';
};

on('click', '#addProductBtn', addProduct);
