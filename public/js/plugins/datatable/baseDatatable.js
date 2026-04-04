export const createDataTable = (tableId, options = {}) => {

    return $(`#${tableId}`).DataTable({
        ...options,
        dom: 'Bfrtip',
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
        },
        responsive: true,
        autoWidth: false,
        serverSide: true,
        processing: true
    });
}

export const reloadDataTable = (tableId) => {

    const table = $(`#${tableId}`).DataTable();
    table.ajax.reload(null, false);
}