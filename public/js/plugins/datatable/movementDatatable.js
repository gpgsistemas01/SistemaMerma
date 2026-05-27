import { getAllDepartments } from "../../application/admin/movements.js";
import { createDataTable, renderActionButtons } from "./baseDatatable.js";

const selector = '#table';

export const createMovementDatatable = () => {

    const table = createDataTable({
        options: {
            ajax: {
                get: (params) => getAllDepartments({
                    ...params,
                })
            },
            columns: [
                { data: 'quantity', title: 'Cantidad' }
            ]
        }
    });
}