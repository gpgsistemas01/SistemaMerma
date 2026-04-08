import { AppError } from "../AppError.js";

export class ProductConsumptionNotFound extends AppError {
    constructor() {
        super('Consumo de producto no encontrado', 'PRODUCT_CONSUMPTION_NOT_FOUND', 404);
    }
}

export class ProductConsumptionProjectNotFound extends AppError {
    constructor() {
        super('Proyecto no encontrado', 'PROJECT_NOT_FOUND', 404);
    }
}

export class ProductConsumptionRequesterProfileNotFound extends AppError {
    constructor() {
        super('Perfil responsable no encontrado', 'REQUESTER_PROFILE_NOT_FOUND', 404);
    }
}

export class ProductConsumptionMachineNotFound extends AppError {
    constructor() {
        super('Máquina no encontrada', 'MACHINE_NOT_FOUND', 404);
    }
}

export class ProductConsumptionGoodsIssueNotFound extends AppError {
    constructor() {
        super('Salida de almacén no encontrada en el detalle', 'PRODUCT_CONSUMPTION_GOODS_ISSUE_NOT_FOUND', 404);
    }
}

export class ProductConsumptionUpdateDatabaseError extends AppError {
    constructor() {
        super('Error de base de datos al editar el consumo de producto', 'PRODUCT_CONSUMPTION_UPDATE_DB_ERROR', 500);
    }
}
