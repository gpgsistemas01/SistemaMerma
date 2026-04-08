import { body } from "express-validator";
import { validateDate, validateUUID } from "../fields/fieldsValidator.js";
import { errorMap } from "../../messages/codeMessages.js";

const validateConsumptionDetailsArray =
    body('details')
        .isArray({ min: 1 }).withMessage(errorMap['details'].REQUIRED)
        .custom(details => {
            details.forEach(detail => {
                if (!detail.productId || !detail.goodsIssueId || !detail.consumedSquareMeters) {
                    throw new Error(errorMap['details'].INVALID_FORMAT_REQUIRED);
                }

                const qty = Number(detail.consumedSquareMeters);
                if (!Number.isFinite(qty) || qty < 1) {
                    throw new Error(errorMap['details'].INVALID_FORMAT_QUANTITY);
                }
            });
            return true;
        });

export const productConsumptionValidation = [
    validateUUID('requesterId'),
    validateUUID('projectId'),
    validateUUID('machineId'),
    validateDate('requestDate'),
    validateConsumptionDetailsArray
];
