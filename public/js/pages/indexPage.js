import { notifications } from "../plugins/swal/swalComponent.js";
import { handleFlashMessage, handleModalWithFlashMessage } from "../handlers/flashMessageHandler.js";

handleFlashMessage(window.FLASH_MESSAGE || null);
handleModalWithFlashMessage(window.FLASH_MESSAGE || null);

const successMessage = localStorage.getItem('showSuccessToast');

if (successMessage) {
    
    notifications.showSuccess(successMessage);
    localStorage.removeItem('showSuccessToast');
}

document.querySelectorAll('.dropdown').forEach(dropdown => {
    const btn = dropdown.querySelector('button[data-mdb-dropdown-init]');
    const instance = mdb.Dropdown.getOrCreateInstance(btn);
    dropdown.addEventListener('mouseenter', () => {
        instance.show();
    });
    dropdown.addEventListener('mouseleave', () => {
        instance.hide();
        btn.blur();
    });
});