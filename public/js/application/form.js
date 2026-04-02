import { getErrorMessage } from "../constants/apiMessages.js";
import { mapServerErrors } from "../core/forms/mappers/formMapper.js";
import { notifications } from "../plugins/swal/swalComponent.js";
import { toggleErrorMessages } from "../ui/forms/formMessagesUI.js";
import { on } from "../utils/domUtils.js";

export const useForm = async ({ 
    selector,
    normalizeData = () => {},
    normalizeErrors = () => {},
    getErrors = () => {},
    sendRequest,
    normalizeServerErrors = () => {},
}) => {

    on('submit', selector, async (e, form) => {

        e.preventDefault();

        const formData = Object.fromEntries(new FormData(form));

        normalizeData(form, formData);

        const errors = getErrors(formData);

        normalizeErrors({ form, errors });
        toggleErrorMessages(form, errors);

        const hasErrors = Object.values(errors).some(error => error);

        if (hasErrors) return;

        try {

            await sendRequest({ formData, form });

        } catch (err) {

            const { response } = err;

            if (response) {

                const { status, code } = response;

                const message = getErrorMessage(code);

                switch (status) {
                    case 400:
                        const errors = mapServerErrors(response.data.errors);
                        normalizeServerErrors(form, errors);
                        toggleErrorMessages(form, errors);
                        break;

                    case 401:
                        window.location.replace('/');
                        notifications.showError(message);
                        break;
                    
                    default:
                        throw err;
                }
            }
            
            throw err;
        }
    });
}