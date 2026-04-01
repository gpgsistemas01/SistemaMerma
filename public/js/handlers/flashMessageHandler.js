import { getErrorMessage, getSuccessMessage } from "../constants/apiMessages.js";
import { showModal } from "../ui/modalUI.js";
import { notifications } from "../plugins/swal/swalComponent.js";

export const handleFlashMessage = (flash) => {
    
    if (!flash) return;

    const { message, type, code } = flash;

    switch (type) {

        case 'success':
            notifications.showSuccess(message || getSuccessMessage(code));
            break;

        case 'warning':
            notifications.showWarning(message || getErrorMessage(code));
            break;

        case 'error':
            notifications.showError(message || getErrorMessage(code));
            break;
            
        default:
            break;
    }
}

export const handleModalWithFlashMessage = (flash) => {

    if (!flash) return;

    const { code } = flash;

    switch (code) {

        case 'GOOGLE_LOGIN_ERROR':
            showModal('loginModal');
            break;
            
        default:
            break;
    }
}