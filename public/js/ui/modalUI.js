import { hideModal, initMdbModal } from "../plugins/mdb/baseInstance.js";

export const closeModal = (form) => {
    
    const modalElement = document.getElementById('modal');
    const modal = initMdbModal(modalElement);
    hideModal({ el: modalElement, modal, form });
}