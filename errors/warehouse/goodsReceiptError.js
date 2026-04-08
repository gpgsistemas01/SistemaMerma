import { AppError } from "../AppError.js";

export class GoodsReceiptNotFound extends AppError {

    constructor() {
        super('Recibo de mercancía no encontrado', 'GOODS_RECEIPT_NOT_FOUND', 404);
    }
}

export class SupplierNotFound extends AppError {

    constructor() {
        super('Proveedor no encontrado', 'SUPPLIER_NOT_FOUND', 404);
    }
}

export class ProfileNotFound extends AppError {

    constructor() {
        super('Perfil no encontrado', 'PROFILE_NOT_FOUND', 404);
    }
}

export class GoodsReceiptUpdateDatabaseError extends AppError {

    constructor() {
        super('Error de base de datos al editar el recibo de mercancía', 'GOODS_RECEIPT_UPDATE_DB_ERROR', 500);
    }
}

export class GoodsReceiptStatusNotFound extends AppError {

    constructor() {
        super('Estado de recepción de compra no encontrado', 'GOODS_RECEIPT_STATUS_NOT_FOUND', 404);
    }
}

export class GoodsReceiptReceptionDateRequired extends AppError {

    constructor() {
        super('La fecha de recepción es obligatoria para actualizar el estado.', 'GOODS_RECEIPT_RECEPTION_DATE_REQUIRED', 400);
    }
}

export class GoodsReceiptStatusUpdateDatabaseError extends AppError {

    constructor() {
        super('Error de base de datos al editar el estado de la recepción de compra', 'GOODS_RECEIPT_STATUS_UPDATE_DB_ERROR', 500);
    }
}
