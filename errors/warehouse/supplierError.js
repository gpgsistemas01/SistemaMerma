import { AppError } from "../AppError.js";

export class SupplierNotFound extends AppError {

    constructor() {
        super('Proveedor no encontrado', 'SUPPLIER_NOT_FOUND', 404);
    }
}

export class SupplierUpdateDatabaseError extends AppError {

    constructor() {
        super('Error de base de datos al editar el proveedor', 'SUPPLIER_UPDATE_DB_ERROR', 500);
    }
}
