import { createCategoryDtoForRegister } from "../../../dtos/categoryDTO.js";
import { successCodeMessages } from "../../../messages/codeMessages.js";
import { findAllCategories, createCategory, updateCategory } from "../../../services/categoryService.js";

export const getAllCategories = async (req, res) => {

    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const search = req.query.search?.value || '';

    const columns = ['name'];
    const orderColumnIndex = req.query.order?.[0]?.column || 0;
    const orderDir = req.query.order?.[0]?.dir || 'asc';

    const result = await findAllCategories({
        skip: start,
        take: length,
        search,
        orderBy: columns[orderColumnIndex],
        orderDir
    });

    res.status(200).json(result);
}

export const registerCategory = async (req, res) => {

    const categoryDto = createCategoryDtoForRegister(req.body);

    const category = await createCategory(categoryDto);

    return res.status(200).json({
        category,
        code: successCodeMessages.CREATED_CATEGORY
    });
}

export const editCategory = async (req, res) => {

    const categoryDto = createCategoryDtoForRegister(req.body);

    const category = await updateCategory(categoryDto, req.params.id);

    return res.status(200).json({
        category,
        code: successCodeMessages.UPDATED_CATEGORY
    });
}