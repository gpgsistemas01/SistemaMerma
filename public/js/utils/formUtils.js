import { reloadDataTable } from "../plugins/datatable/baseDatatable.js";
import { notifications } from "../plugins/swal/swalComponent.js";

export const hadnleSuccess = async ({ form, formData, create, update, tableId }) => {
    
    const id = form.dataset.id;
    const mode = form.dataset.mode;
    let response;

    if (mode === 'create') response = await create(formData);
    else response = await update(formData, id);

    notifications.showSuccess(response.message);

    form.reset();
    form.dataset.mode = '';
    form.dataset.id = '';

    const modalElement = document.getElementById('modal');
    const modal = mdb.Modal.getOrCreateInstance(modalElement);

    modal.hide();

    reloadDataTable('productTable');
}

export const validateFields = (validators, formData) => {

    const errors = {};

    Object.keys(validators).forEach(field => {
        errors[field] = validators[field](formData[field]);
    });

    return errors;
}

export const setFormReadOnly = ({
    form,
    isReadOnly
}) => {
    
    const elements = form.querySelectorAll('input, select, textarea');

    elements.forEach(el => {
        if (isReadOnly) {
            el.setAttribute('disabled', 'disabled');
        } else {
            el.removeAttribute('disabled');
        }
    });

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.style.display = isReadOnly ? 'none' : 'block';
};