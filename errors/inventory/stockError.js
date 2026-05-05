import { AppError } from "../AppError.js";

export class GoodsIssueInsufficientStock extends AppError {

    constructor ({ productName, height, base, supplierName }) {
        super(
            `Stock insuficiente para realizar la salida con el producto: ${ productName } (${ base } x ${ height }) y proveedor: ${ supplierName }`, 
            'GOODS_ISSUE_INSUFFICIENT_STOCK', 
            409
        );

        this.meta = { productName, height, base, supplierName };
    }
}

export class GoodsIssueInexistentStock extends AppError {

    constructor ({ productName, height, base, supplierName }) {
        super(
            `Stock inexistente para realizar la salida con el producto: ${ productName } (${ base } x ${ height }) y proveedor: ${ supplierName }`, 
            'GOODS_ISSUE_INEXISTENT_STOCK', 
            409
        );

        this.meta = { productName, height, base, supplierName };
    }
}