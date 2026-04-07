import { AppError } from "../AppError.js";

export class PurchaseRequisitionNotFound extends AppError {

    constructor() {
        super('Requisición de compra no encontrada', 'PURCHASE_REQUISITION_NOT_FOUND', 404);
    }
}

export class ProjectNotFound extends AppError {

    constructor() {
        super('Proyecto no encontrado', 'PROJECT_NOT_FOUND', 404);
    }
}

export class RequesterProfileNotFound extends AppError {

    constructor() {
        super('Perfil solicitante no encontrado', 'REQUESTER_PROFILE_NOT_FOUND', 404);
    }
}

export class PurchaseRequisitionStatusNotFound extends AppError {

    constructor() {
        super('Estado de requisición no encontrado', 'PURCHASE_REQUISITION_STATUS_NOT_FOUND', 404);
    }
}
