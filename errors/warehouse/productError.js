import { AppError } from "../AppError.js";

export class ProductNotFound extends AppError {

    constructor() {
        super('Producto no encontrado', 'PRODUCT_NOT_FOUND', 404);
    }
}