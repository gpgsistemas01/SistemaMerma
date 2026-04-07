import { createProductDatatable } from "../../plugins/datatable/productDatatable.js";
import { useForm } from "../../application/form.js";
import { editProduct, registerProduct } from "../../application/warehouse/products.js";
import { productValidators } from "../../core/validations/validators.js";
import { handleSubmit, validateFields } from "../../utils/formUtils.js";
import { setFormReadOnly, toggleButtons, toggleInputSelectErrors } from "../../ui/formUI.js";
import { initProductSelect2 } from "../../plugins/select2/productSelect.js";

createProductDatatable();

useForm({
    normalizeData: ({ formData }) => {
        formData.isActive = document.getElementById('isActiveInput').checked;
    },
    getErrors: (formData) => {
        
        let errors = {};

        errors = validateFields(productValidators, formData);

        if (!errors.minStock && formData.minStock > formData.maxStock) errors.minStock = 'El stock mínimo no debe ser mayor al stock máximo';

        return errors;
    },
    normalizeErrors: (form, errors) => toggleInputSelectErrors(form, errors),
    sendRequest: async ({ formData, form }) => {

        await handleSubmit({
            form,
            formData,
            create: registerProduct,
            update: editProduct
        });
    },
    normalizeServerErrors: (form, serverErrors) => toggleInputSelectErrors(form, serverErrors)
});

export const openProductModal = async ({ mode, data = null }) => {
    
    const form = document.getElementById('form');

    form.dataset.mode = mode;
    form.dataset.id = data?.id || '';

    setFormReadOnly({ form, isReadOnly: false });

    if (mode === 'create') {
        
        form.reset();
        document.getElementById('modalTitle').textContent = 'Registrar producto';
        document.getElementById('submitBtn').textContent = 'Guardar';

        await initProductSelect2();
    }

    if (mode === 'edit' || mode === 'view') {

        document.getElementById('nameInput').value = data.name;
        document.getElementById('unitCostInput').value = data.unitCost;
        document.getElementById('minStockInput').value = data.minStock;
        document.getElementById('maxStockInput').value = data.maxStock;
        document.getElementById('expiryDateInput').value = data.expiryDate ? new Date(data.expiryDate) : '';
        document.getElementById('thicknessInput').value = data.thickness || '';
        document.getElementById('baseInput').value = data.base || '';
        document.getElementById('heightInput').value = data.height || '';
        document.getElementById('colorInput').value = data.color || '';
        document.getElementById('typeInput').value = data.type || '';
        document.getElementById('presentationInput').value = data.presentation || '';
        document.getElementById('isActiveInput').checked = data.isActive;

        await initProductSelect2(data);

        if (mode === 'edit') {

            document.getElementById('modalTitle').textContent = 'Editar producto';
            document.getElementById('submitBtn').textContent = 'Actualizar';
        }

        if (mode === 'view') {

            document.getElementById('modalTitle').textContent = 'Ver producto';

            setFormReadOnly({ form, isReadOnly: true });
        }


    }

    const modalElement = document.getElementById('modal');
    const modal = mdb.Modal.getOrCreateInstance(modalElement);
    modal.show();
}