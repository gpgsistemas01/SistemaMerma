import { createProductConsumptionDtoForRegister } from "../../../dtos/productConsumptionDTO.js";
import { successCodeMessages } from "../../../messages/codeMessages.js";
import {
    createProductConsumption,
    findAllMachines,
    findAllProductConsumptions,
    updateProductConsumption
} from "../../../services/warehouse/productConsumptionService.js";
import { sanitizeEmptyStrings } from "../../../utils/formattersUtils.js";

export const getAllProductConsumptions = async (req, res) => {
    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const search = req.query.search?.value || '';

    const columns = ['requestDate'];
    const orderColumnIndex = req.query.order?.[0]?.column || 0;
    const orderDir = req.query.order?.[0]?.dir || 'asc';

    const result = await findAllProductConsumptions({
        skip: start,
        take: length,
        search,
        orderBy: columns[orderColumnIndex],
        orderDir
    });

    res.status(200).json(result);
};

export const registerProductConsumption = async (req, res) => {
    const dto = createProductConsumptionDtoForRegister(req.body);
    const sanitizedDto = sanitizeEmptyStrings(dto);

    const productConsumption = await createProductConsumption(sanitizedDto);

    return res.status(200).json({
        productConsumption,
        code: successCodeMessages.CREATED_PRODUCT_CONSUMPTION
    });
};

export const editProductConsumption = async (req, res) => {
    const dto = createProductConsumptionDtoForRegister(req.body);
    const sanitizedDto = sanitizeEmptyStrings(dto);

    const productConsumption = await updateProductConsumption({
        productConsumptionDto: sanitizedDto,
        id: req.params.id
    });

    return res.status(200).json({
        productConsumption,
        code: successCodeMessages.UPDATED_PRODUCT_CONSUMPTION
    });
};

export const getAllMachinesController = async (req, res) => {
    const machines = await findAllMachines();
    return res.status(200).json({ data: machines });
};
