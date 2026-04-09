import { createSupplierDatatable } from "../../plugins/datatable/supplierDatatable.js";
import { useForm } from "../../application/form.js";
import { editSupplier, registerSupplier } from "../../application/warehouse/suppliers.js";
import { supplierValidators } from "../../core/validations/validators.js";
import { handleSubmit, validateFields } from "../../utils/formUtils.js";
import { setFormReadOnly } from "../../ui/formUI.js";

createSupplierDatatable();

useForm({
    normalizeData: ({ formData }) => {
        formData.isActive = document.getElementById('isActiveInput').checked;
    },
    getErrors: (formData) => {
        
        let errors = {};

        errors = validateFields(supplierValidators, formData);

        return errors;
    },
    sendRequest: async ({ formData, form }) => {

        await handleSubmit({
            form,
            formData,
            create: registerSupplier,
            update: editSupplier,
        });
    }
});

export const openSupplierModal = ({ mode, data = null }) => {

    const form = document.getElementById('form');

    form.dataset.mode = mode;
    form.dataset.id = data?.id || '';

    setFormReadOnly({ form, isReadOnly: false });

    if (mode === 'create') {

        form.reset();
        document.getElementById('modalTitle').textContent = 'Registrar proveedor';
        document.getElementById('submitBtn').textContent = 'Guardar';
    }

    if (mode === 'edit' || mode === 'view') {

        document.getElementById('nameInput').value = data.name;
        document.getElementById('numberphoneInput').value = data.numberphone || '';
        document.getElementById('isActiveInput').checked = data.isActive;

        if (mode === 'edit') {

            document.getElementById('modalTitle').textContent = 'Editar proveedor';
            document.getElementById('submitBtn').textContent = 'Actualizar';
        }

        if (mode === 'view') {

            document.getElementById('modalTitle').textContent = 'Ver proveedor';

            setFormReadOnly({ form, isReadOnly: true });
        }
    }

    const modalElement = document.getElementById('modal');
    const modal = mdb.Modal.getOrCreateInstance(modalElement);
    modal.show();
}