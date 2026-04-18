import { AppError } from "../AppError.js";

export class DepartmentNotFound extends AppError {

    constructor() {
        super('Departamento no encontrado', 'DEPARTMENT_NOT_FOUND', 404);
    }
}