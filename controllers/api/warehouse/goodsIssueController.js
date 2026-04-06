import { createGoodsIssueDtoForRegister } from "../../../dtos/goodsIssueDTO.js";
import { successCodeMessages } from "../../../messages/codeMessages.js";
import { createGoodsIssue, findAllGoodsIssues, updateGoodsIssue } from "../../../services/warehouse/goodsIssueService.js";
import { sanitizeEmptyStrings } from "../../../utils/formattersUtils.js";

export const getAllGoodsIssues = async (req, res) => {

    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const search = req.query.search?.value || '';

    const columns = ['requestDate'];
    const orderColumnIndex = req.query.order?.[0]?.column || 0;
    const orderDir = req.query.order?.[0]?.dir || 'asc';

    const result = await findAllGoodsIssues({
        skip: start,
        take: length,
        search,
        orderBy: columns[orderColumnIndex],
        orderDir,
        userDepartment: req.user?.department,
        userRole: req.user?.role
    });

    res.status(200).json(result);
};

export const registerGoodsIssue = async (req, res) => {

    const goodsIssueDto = createGoodsIssueDtoForRegister(req.body);
    const sanitizedGoodsIssueDto = sanitizeEmptyStrings(goodsIssueDto);

    const goodsIssue = await createGoodsIssue(sanitizedGoodsIssueDto);

    return res.status(200).json({
        goodsIssue,
        code: successCodeMessages.CREATED_GOODS_ISSUE
    });
};

export const editGoodsIssue = async (req, res) => {

    const goodsIssueDto = createGoodsIssueDtoForRegister(req.body);
    const sanitizedGoodsIssueDto = sanitizeEmptyStrings(goodsIssueDto);

    const goodsIssue = await updateGoodsIssue(sanitizedGoodsIssueDto, req.params.id);

    return res.status(200).json({
        goodsIssue,
        code: successCodeMessages.UPDATED_GOODS_ISSUE
    });
};
