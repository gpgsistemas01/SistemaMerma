export const toggleErrorMessages = (form, errors) => {

    Object.entries(errors).forEach(([field, message]) => {

        const input = form.querySelector(`[name='${ field }']`);
        const feedback = form.querySelector(`[data-error-for='${ field }']`);

        if (!input || !feedback) return;

        if (message) {

            feedback.textContent = message;
            input.classList.add('is-invalid');

        } else {

            feedback.textContent = null;
            input.classList.remove('is-invalid');
        }
    });
}

const setInputSelectError = (form, key, message = null) => {

    const feedback = form.querySelector(`[data-error-for='${ key }']`);

    if (!feedback) return;

    if (message) {

        feedback.textContent = message;
        feedback.classList.add('d-block');

    } else {

        feedback.textContent = null;
        feedback.classList.remove('d-block');
    }
}

export const toggleInputSelectErrors = (form, errors) => {

    form.querySelectorAll('select').forEach(input => {

        const key = input.name;
        const value = errors[key];
        
        setInputSelectError(form, key, value);

        if ($(input).hasClass('select2-hidden-accessible')) {

            if (value) $(input).next('.select2-container').find('.select2-selection').addClass('is-invalid');
            else $(input).next('.select2-container').find('.select2-selection').removeClass('is-invalid');
        }
    });
}

const setTableError = (form, key, message = null) => {

    const feedback = form.querySelector(`[data-error-for=${ key }]`);

    if (!feedback) return;

    if (message) {

        feedback.textContent = message;
        feedback.classList.remove('d-none');

    } else {

        feedback.textContent = null;
        feedback.classList.add('d-none');
    }
}

export const toggleTableErrors = (form, errors) => {

    const key = 'details';
    const value = errors[key];
    setTableError(form, key, value);
}

export const setFormReadOnly = ({
    form,
    isReadOnly
}) => {
    
    const elements = form.querySelectorAll('input, select, textarea');

    elements.forEach(el => {
        if (isReadOnly) {
            el.setAttribute('disabled', 'disabled');
        } else {
            el.removeAttribute('disabled');
        }
    });

    form.querySelector('#submitBtn').classList.toggle('d-none', isReadOnly);
};

export const toggleButtons = (mode) => {

    const isView = mode === 'view';
    document.querySelector('.add-product-container').classList.toggle('d-none', isView);
    document.querySelector('.approve-container').classList.toggle('d-none', !isView);
}