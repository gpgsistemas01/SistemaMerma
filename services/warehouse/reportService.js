import { findAllSupplierProducts } from "./products/supplierProductService.js";

const mapProductRows = (products = []) => products.map((item) => ({
    material: item.name,
    base: item.base,
    altura: item.height,
    existencia: item.currentStock,
    stockMinimo: item.minStock,
    presentacion: item.presentation?.name,
    cantidadConversion: item.convertedQuantity,
    unidad: item.unitMeasure?.name,
    costoUnitarioConversion: item.maxUnitCost
}));

export const findWarehouseReportRows = async () => {

    const productsResult = await findAllSupplierProducts({
        skip: 0,
        take: 100000,
        search: '',
        supplierId: null,
        orderBy: 'name',
        orderDir: 'asc'
    });

    return mapProductRows(productsResult.data);
};
