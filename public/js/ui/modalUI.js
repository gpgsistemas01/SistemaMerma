export const closeModal = (idModal, form) => {
    
    const modalHtml = document.getElementById(idModal);
    const modal = mdb.Modal.getInstance(modalHtml);

    modalHtml.addEventListener('hidden.mdb.modal', () => {
        form.reset();
    });
    modal.hide();
}

export const showModal = (idModal) => {

    const modalHtml = document.getElementById(idModal);
    const modal = new mdb.Modal(modalHtml);

    modal.show();
}