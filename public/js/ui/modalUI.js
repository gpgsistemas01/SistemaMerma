import { hideModal, initMdbModal, modalStack, showModal } from "../plugins/mdb/baseInstance.js";

export const openModal = (modalElement) => {

    const instance = initMdbModal(modalElement);

    showModal(instance);
}

export const closeModal = (form) => {
    
    const current = modalStack.pop();

    if (!current) return;

    const currentEl = current._element;
    hideModal({ el: currentEl, modal: current, form });
}

export const backModal = () => {

    const current = modalStack.pop();

    if (current) current.hide();

    const previous = modalStack[modalStack.length - 1];

    const currentEl = current._element;

    if (previous) {
        currentEl.addEventListener('hidden.mdb.modal', () => {
            previous._isShown = false;
            previous.show();
        }, { once: true });
    }

    current.hide();
};