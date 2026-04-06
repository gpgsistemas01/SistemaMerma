import { createPurchaseRequisitionDtoForRegister } from "../../../dtos/purchaseRequisitionDTO.js";
import { successCodeMessages } from "../../../messages/codeMessages.js";
import { createPurchaseRequisition, findAllPurchaseRequisitions, updatePurchaseRequisition } from "../../../services/warehouse/purchaseRequisitionService.js";
import { sanitizeEmptyStrings } from "../../../utils/formattersUtils.js";
import { prisma } from "../../../lib/prisma.js";
import { RequesterProfileNotFound } from "../../../errors/warehouse/purchaseRequisitionError.js";

const getRequesterIdByUser = async (userId) => {

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            profiles: {
                where: { isActive: true },
                take: 1,
                select: { id: true }
            }
        }
    });

    const requesterId = user?.profiles?.[0]?.id;

    if (!requesterId) throw new RequesterProfileNotFound();

    return requesterId;
};

export const getAllPurchaseRequisitions = async (req, res) => {

    const { department = '' } = req.query;

    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const search = req.query.search?.value || '';

    const columns = ['requestDate'];
    const orderColumnIndex = req.query.order?.[0]?.column || 0;
    const orderDir = req.query.order?.[0]?.dir || 'asc';

    const result = await findAllPurchaseRequisitions({
        currentDepartment: department,
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

export const registerPurchaseRequisition = async (req, res) => {

    const purchaseRequisitionDto = createPurchaseRequisitionDtoForRegister(req.body);
    const sanitizedPurchaseRequisitionDto = sanitizeEmptyStrings(purchaseRequisitionDto);
    const requesterId = await getRequesterIdByUser(req.userId);

    const purchaseRequisition = await createPurchaseRequisition({
        ...sanitizedPurchaseRequisitionDto,
        requesterId
    });

    return res.status(200).json({
        purchaseRequisition,
        code: successCodeMessages.CREATED_PURCHASE_REQUISITION
    });
};

export const editPurchaseRequisition = async (req, res) => {

    const purchaseRequisitionDto = createPurchaseRequisitionDtoForRegister(req.body);
    const sanitizedPurchaseRequisitionDto = sanitizeEmptyStrings(purchaseRequisitionDto);
    const requesterId = await getRequesterIdByUser(req.userId);

    const purchaseRequisition = await updatePurchaseRequisition({
        ...sanitizedPurchaseRequisitionDto,
        requesterId
    }, req.params.id);

    return res.status(200).json({
        purchaseRequisition,
        code: successCodeMessages.UPDATED_PURCHASE_REQUISITION
    });
};
