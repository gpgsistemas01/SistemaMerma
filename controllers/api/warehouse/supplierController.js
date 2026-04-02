import { createSupplierDtoForRegister } from "../../../dtos/supplierDto.js";
import { successCodeMessages } from "../../../messages/codeMessages.js";
import { findAllSuppliers, createSupplier, updateSupplier } from "../../../services/supplierService.js";

export const getAllSuppliers = async (req, res) => {

    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const search = req.query.search?.value || '';

    const columns = ['name'];
    const orderColumnIndex = req.query.order?.[0]?.column || 0;
    const orderDir = req.query.order?.[0]?.dir || 'asc';

    const result = await findAllSuppliers({
        skip: start,
        take: length,
        search,
        orderBy: columns[orderColumnIndex],
        orderDir
    });

    res.status(200).json(result);
}

export const registerSupplier = async (req, res) => {

    const supplierDto = createSupplierDtoForRegister(req.body);

    const supplier = await createSupplier(supplierDto);

    return res.status(200).json({
        supplier,
        code: successCodeMessages.CREATED_SUPPLIER
    });
}

export const editSupplier = async (req, res) => {

    const supplierDto = createSupplierDtoForRegister(req.body);

    const supplier = await updateSupplier(supplierDto, req.params.id);

    return res.status(200).json({
        supplier,
        code: successCodeMessages.UPDATED_SUPPLIER
    });
}