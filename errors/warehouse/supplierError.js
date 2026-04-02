import { AppError } from "../AppError.js";

export class SupplierNotFound extends AppError {

    constructor() {
        super('Proveedor no encontrado', 'SUPPLIER_NOT_FOUND', 404);
    }
}