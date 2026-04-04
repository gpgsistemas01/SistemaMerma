export const initbaseSelect2 = ({ 
    selector, 
    url, 
    placeholder,
    processResults,
}) => {

    if ($(selector).hasClass("select2-hidden-accessible")) $(selector).select2('destroy');

    $(selector).select2({ 
        language: 'es',
        placeholder: placeholder, 
        dropdownParent: $('#modal'),
        minimumInputLength: 0, 
        ajax: { 
            url: url, 
            dataType: 'json', 
            delay: 250, 
            data: function (params) { 
                return { 
                    search: params.term 
                }; 
            }, 
            processResults: processResults 
        } 
    });
}