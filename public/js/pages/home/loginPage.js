import { login } from "../../application/auth/login.js";
import { useForm } from "../../application/form.js";
import { validateFields } from "../../utils/formUtils.js";
import { loginValidators } from "../../utils/validations/validators.js";

document.getElementById('submitBtn').textContent = 'Ingresar';

useForm({
    getErrors: (formData) => {

        let errors = {};

        errors = validateFields(loginValidators, formData);

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