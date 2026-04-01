import { showToast } from "./baseSwal.js";

export const notifications = {
    showSuccess: (title) => showToast({ title, icon: 'success' }),
    showWarning: (title) => showToast({ title, icon: 'warning' }),
    showError: (title) => showToast({ title, icon: 'error' }),
    showInfo: (title) => showToast({ title })
}