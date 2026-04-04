import { AppError } from "../AppError.js";

export class ProductNotFound extends AppError {

    constructor() {
        super('Producto no encontrado', 'PRODUCT_NOT_FOUND', 404);
    }
}

export class UomNotFound extends AppError {

    constructor() {
        super('Unidad de medida no encontrada', 'UOM_NOT_FOUND', 404);
    }
}

export class CategoryNotFound extends AppError {

    constructor() {
        super('Categoría no encontrada', 'CATEGORY_NOT_FOUND', 404);
    }
}