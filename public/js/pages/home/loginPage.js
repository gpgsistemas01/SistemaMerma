import { login } from "../../application/auth/login.js";
import { useForm } from "../../application/form.js";
import { validators } from "../../core/validations/validators.js";

useForm({
    selector: '#loginForm',
    getErrors: (formData) => {

        const errors = {};

        errors.name = validators.username(formData.name);
        errors.password = validators.password(formData.password);

        return errors;
    },
    normalizeErrors: ({ errors }) => {

        errors.name = errors.name ? 'Usuario incorrecto' : null;
        errors.password = errors.password ? 'Contraseña incorrecta' : null;

        return errors;
    },
    sendRequest: async ({ formData }) => {

        const response = await login(formData);

        localStorage.setItem('showSuccessToast', response.message);
        window.location.replace('/productos');
    }
});