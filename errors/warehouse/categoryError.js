import { AppError } from "../AppError.js";

export class CategoryNotFound extends AppError {

    constructor() {
        super('Categoría no encontrada', 'CATEGORY_NOT_FOUND', 404);
    }
}