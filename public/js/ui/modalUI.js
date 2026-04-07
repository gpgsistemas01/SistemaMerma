import { cleanForm } from "../utils/formUtils.js";

export const closeModal = (form) => {
    
    const modalElement = document.getElementById('modal');
    const modal = mdb.Modal.getOrCreateInstance(modalElement);

    modalElement.addEventListener('hidden.mdb.modal', () => {
        cleanForm(form);
    });
    modal.hide();
}