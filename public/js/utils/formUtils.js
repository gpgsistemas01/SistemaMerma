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

    const table = $(tableId).DataTable();

    table.draw(null, false);
}