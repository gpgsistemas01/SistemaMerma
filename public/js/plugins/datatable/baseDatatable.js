export const createDataTable = ({ selector = '#table', options = {} }) => {

    return $(selector).DataTable({
        ...options,
        dom: 'Bfrtip',
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
        },
        responsive: true,
        autoWidth: false,
        serverSide: options.ajax ? true : false,
        processing: options.ajax ? true : false,
    });
}

export const reloadMainTable = () => {

    const table = $('#table').DataTable();
    table.ajax.reload(null, false);
}

export const refreshProductTable = (details) => {

    const table = $('#productTable').DataTable();
    table.clear();
    table.rows.add(details);
    table.draw();
}