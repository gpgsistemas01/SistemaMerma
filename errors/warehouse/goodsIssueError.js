import { AppError } from "../AppError.js";

export class GoodsIssueNotFound extends AppError {

    constructor() {
        super('Salida de almacén no encontrada', 'GOODS_ISSUE_NOT_FOUND', 404);
    }
}

export class GoodsIssueProjectNotFound extends AppError {

    constructor() {
        super('Proyecto no encontrado', 'PROJECT_NOT_FOUND', 404);
    }
}

export class GoodsIssueRequesterProfileNotFound extends AppError {

    constructor() {
        super('Perfil solicitante no encontrado', 'REQUESTER_PROFILE_NOT_FOUND', 404);
    }
}

export class GoodsIssueUpdateDatabaseError extends AppError {

    constructor() {
        super('Error de base de datos al editar la salida de almacén', 'GOODS_ISSUE_UPDATE_DB_ERROR', 500);
    }
}
