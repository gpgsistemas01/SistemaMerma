import { hasPermission } from "../../../utils/permissions.js";
import { createDataTable } from "../baseDatatable.js";
import { buildDetailsColumns, buildDetailsHeader } from "./builderDetailDatatable.js";

export const renderMaterialName = (row, supplierOverride) => {

    const supplierName = supplierOverride || row.supplier?.tradeName || row.supplierName;
    const productName = row.productName || row.name;

    if (!row.productBase || !row.productHeight) {
        return `${ productName } || ${ supplierName }`;
    }

    return `${ productName } (${ row.productBase } x ${ row.productHeight }) || ${ supplierName }`;
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