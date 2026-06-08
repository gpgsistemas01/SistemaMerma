import { AppError } from "../AppError.js";

export class WasteAlreadyExists extends AppError {

    constructor () {
        super('La merma ya existe para el producto, base y altura seleccionados.', 'WASTE_ALREADY_EXISTS', 409);
    }
}
