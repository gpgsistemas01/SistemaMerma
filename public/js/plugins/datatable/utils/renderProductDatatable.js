import { hasPermission } from "../../../utils/permissions.js";
import { createDataTable } from "../baseDatatable.js";
import { buildDetailsColumns, buildDetailsHeader } from "./builderDetailDatatable.js";

export const renderMaterialName = (row, supplierOverride) => {

    const supplier = supplierOverride || row.supplier?.tradeName || row.supplier;

    if (!row.base || !row.height) {
        return `${row.name} || ${supplier}`;
    }

    return `${row.name} (${row.base} x ${row.height}) || ${supplier}`;
};

export const initDetailsTable = ({ selector, type, mode, context, data }) => {

    const { isWarehouse, isSystem } = hasPermission(context);

    const table = document.querySelector(selector);

    table.innerHTML = buildDetailsHeader({
        type,
        mode,
        isWarehouse,
        isSystem
    });

    const columns = buildDetailsColumns({
        type,
        mode,
        isWarehouse,
        isSystem
    });

    return createDataTable({
        selector,
        options: {
            data,
            columns
        }
    });
};