export const buildDetailsHeader = ({ type, mode, isWarehouse, isSystem }) => {

    let extraHeaders = '';

    if (type === 'issue' && (isWarehouse || isSystem)) {
        extraHeaders += `
            <th rowspan="2">Costo unitario de Conversión</th>
            <th rowspan="2">Cantidad de proyecto</th>
            <th rowspan="2">Diferencia</th>
        `;
    }

    if (type === 'receipt') {
        extraHeaders += `
            <th rowspan="2">Costo Unitario de Conversión</th>
            <th rowspan="2">Costo por Presentación</th>
            <th rowspan="2">Monto s/ IVA</th>
            <th rowspan="2">Monto c/ IVA</th>
        `;
    }

    if (mode !== 'view') {
        extraHeaders += `<th rowspan="2">Acciones</th>`;
    }

    return `
        <thead>
            <tr>
                <th rowspan="2">Material</th>
                <th colspan="2">Medidas</th>
                <th rowspan="2">${type === 'issue' ? 'Salida' : 'Compra'}</th>
                <th rowspan="2">Presentación</th>
                <th colspan="2">Conversión</th>
                ${extraHeaders}
            </tr>
            <tr>
                <th>Base</th>
                <th>Altura</th>
                <th>Cantidad</th>
                <th>Unidad</th>
            </tr>
        </thead>
    `;
};

export const buildDetailsColumns = ({ type, mode, render, isWarehouse, isSystem }) => {

    const columns = [
        {
            data: null,
            render
        },
        { data: 'base' },
        { data: 'height' },
        { data: 'quantity' },
        { data: 'presentation' },
        { data: 'totalArea' },
        { data: 'unitMeasure' },
    ];

    if (type === 'issue' && (isWarehouse || isSystem)) {
        columns.push(
            { data: 'unitCost' },
            { data: 'projectQuantity' },
            { data: 'difference' }
        );
    }

    if (type === 'receipt') {
        columns.push(
            { data: 'unitCostByArea' },
            { data: 'unitCostByQuantity' },
            { data: 'netPurchaseAmount' },
            { data: 'grossPurchaseAmount' }
        );
    }

    if (mode !== 'view') {
        columns.push({
            data: null,
            render: (_, __, ___, meta) => `
                <button class="btn btn-danger btn-sm delete-btn" data-index="${meta.row}">
                    Eliminar
                </button>
            `
        });
    }

    return columns;
};