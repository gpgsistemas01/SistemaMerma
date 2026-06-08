import { successCodeMessages } from '../../../messages/codeMessages.js';
import { createWasteAdjustment, findAllWastes as findAllWasteItems, updateWaste } from '../../../services/warehouse/wasteService.js';
import { createWasteDto } from '../../../dtos/wasteDTO.js';
import { sanitizeEmptyStrings } from '../../../utils/formattersUtils.js';
import { getDataTableOrder, getDataTablePaging, getDataTableSearch } from '../../../utils/requestQueryUtils.js';

export const getAllWastes = async (req, res) => {

    const { skip, take } = getDataTablePaging(req.query);
    const search = getDataTableSearch(req.query);
    const supplierId = req.query.supplierId || null;

    const columns = ['name', null, null, null, null, null, null, null, null, null];
    const { orderBy, orderDir } = getDataTableOrder({
        query: req.query,
        columns
    });

    const result = await findAllWasteItems({
        skip,
        take,
        search,
        supplierId,
        orderBy,
        orderDir
    });

    return res.status(200).json(result);
};

export const registerWaste = async (req, res) => {

    const wasteDto = createWasteDto(req.body);
    const sanitizedWasteDto = sanitizeEmptyStrings(wasteDto);

    const waste = await createWasteAdjustment({
        wasteDto: sanitizedWasteDto,
        userId: req.user.id
    });

    return res.status(200).json({
        waste,
        code: successCodeMessages.CREATED_WASTE
    });
};

export const editWaste = async (req, res) => {

    const wasteDto = createWasteDto(req.body);
    const sanitizedWasteDto = sanitizeEmptyStrings(wasteDto);

    const waste = await updateWaste({
        id: req.params.id,
        wasteDto: sanitizedWasteDto
    });

    return res.status(200).json({
        waste,
        code: successCodeMessages.UPDATED_WASTE
    });
};
