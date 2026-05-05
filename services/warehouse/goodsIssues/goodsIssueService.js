import {
    GoodsIssueNotFound,
    GoodsIssueRequesterProfileNotFound,
    GoodsIssueUpdateDatabaseError,
    GoodsIssueAdvisorProfileNotFound,
    GoodsIssueFulfillmentCompleteConflict
} from "../../../errors/warehouse/goodsIssueError.js";
import { prisma } from "../../../lib/prisma.js";
import { findProfileById } from "../../admin/profileService.js";
import { findDepartmentById } from "../../admin/departmentService.js";
import { generateReferenceNumber } from "../../document/referenceNumberService.js";
import { findClientById } from "../../sales/clientService.js";
import { buildGoodsIssueDetails, buildGoodsIssueDetailUpdate, resolveFulfillmentStatus } from "./goodsIssueHelpers.js";
import { applyInventoryMovement } from "../../inventory/movementService.js";
import { findProductsByIds } from "../products/productService.js";
import { buildStockKey } from "../../../utils/formattersUtils.js";

const ROLE_SYSTEM_ADMIN = 'Administrador del sistema';
const ROLE_COORDINATOR = 'Coordinador';
const DEPARTMENT_WAREHOUSE = 'ALMACÉN Y PROVEDURÍA';
const FULFILLMENT_PENDING = 'Pendiente';
const FULFILLMENT_COMPLETE = 'Surtido';
const STATUS_APPROVED = 'Aprobada';
const REFERENCE_NUMBER_TYPE = 'SAL';
const REFERENCE_MOVEMENT_OUT = 'OUT';
const FLOAT_EPSILON = 0.000001;

export const findAllGoodsIssues = async ({
    skip = 0,
    take = 10,
    search = '',
    orderBy = 'referenceNumber',
    orderDir = 'asc',
    onlyPending = true,
    accesses = []
}) => {

    const isAdmin = accesses.some(access => access.role === ROLE_SYSTEM_ADMIN);
    const isWarehouseCoordinator = accesses.some(access => 
        access.role === ROLE_COORDINATOR && 
        access.department === DEPARTMENT_WAREHOUSE
    );
    const canViewAll = isAdmin || isWarehouseCoordinator;
    const userDepartments = accesses.map(a => a.department);

    const where = {
        ...(search && {
            referenceNumber: {
                contains: search,
                mode: 'insensitive'
            }
        }),
        ...(onlyPending && {
            fulfillmentStatus: {
                name: {
                    not: FULFILLMENT_COMPLETE
                }
            }
        }),
        ...(!canViewAll && {
            department: {
                name: {
                    in: userDepartments
                }
            }
        })
    };

    const goodsIssues = await prisma.goodsIssue.findMany({
        skip,
        take,
        where,
        orderBy: {
            [orderBy]: orderDir
        },
        include: {
            status: true,
            approver: {
                select: {
                    id: true,
                    fullName: true,
                }
            },
            warehouseStaff: {
                select: {
                    id: true,
                    fullName: true,
                }
            },
            fulfillmentStatus: true,
            details: {
                select: {
                    id: true,
                    productId: true,
                    quantity: true,
                    convertedQuantity: true,
                    maxUnitCost: true,
                    productName: true,
                    productBase: true,
                    productHeight: true,
                    presentationId: true,
                    presentationName: true,
                    unitMeasureId: true,
                    unitMeasureName: true,
                    unitMeasureSymbol: true,
                    projectConvertedQuantity: true,
                    convertedQuantityDifference: true,
                    suppliedQuantity: true,
                    isSupplied: true,
                    fulfillmentStatus: true
                }
            },
            movements: true
        }
    });

    const total = await prisma.goodsIssue.count({ where });
    const filtered = total;

    return {
        data: goodsIssues,
        recordsTotal: total,
        recordsFiltered: filtered
    };
};

export const createGoodsIssue = async ({
    goodsIssueDto
}) => {

    const { requesterId, advisorId, departmentId, clientId, details, ...goodsIssueData } = goodsIssueDto;

    const requester = await findProfileById({ id: requesterId });

    if (!requester) throw new GoodsIssueRequesterProfileNotFound();
    
    const advisor = await findProfileById({ id: advisorId });

    if (!advisor) throw new GoodsIssueAdvisorProfileNotFound();

    const client = await findClientById({ id: clientId });
    const department = await findDepartmentById({ id: departmentId });

    const processedDetails = await buildGoodsIssueDetails({ details });

    const result = await prisma.$transaction(async (tx) => {

        const referenceNumber = await generateReferenceNumber({ type: REFERENCE_NUMBER_TYPE, tx });

        const goodsIssue = await tx.goodsIssue.create({
            data: {
                ...goodsIssueData,
                referenceNumber,
                departmentName: department.name,
                requesterName: requester.fullName,
                advisorName: advisor.fullName,
                clientName: client.name,
                status: {
                    connect: {
                        name: STATUS_APPROVED
                    }
                },
                requester: {
                    connect: {
                        id: requesterId
                    }
                },
                advisor: {
                    connect: {
                        id: advisorId
                    }
                },
                department: {
                    connect: {
                        id: departmentId
                    }
                },
                client: {
                    connect: {
                        id: clientId
                    }
                },
                fulfillmentStatus: {
                    connect: {
                        name: FULFILLMENT_PENDING
                    }
                },
                details: {
                    createMany: {
                        data: processedDetails
                    }
                }
            },
            include: {
                details: {
                    select: {
                        productId: true,
                        quantity: true,
                        convertedQuantity: true,
                        maxUnitCost: true,
                        productName: true,
                        productBase: true,
                        productHeight: true,
                        presentationId: true,
                        presentationName: true,
                        unitMeasureId: true,
                        unitMeasureName: true,
                        unitMeasureSymbol: true
                    }
                }
            }
        });

        return { goodsIssue };
    });

    return result.goodsIssue;
};

export const updateGoodsIssueDetails = async ({ id, goodsIssueDto }) => {

    const { details = [] } = goodsIssueDto;

    try {

        return await prisma.$transaction(async (tx) => {

            const goodsIssue = await tx.goodsIssue.findUnique({
                where: { id },
                select: {
                    id: true,
                    fulfillmentStatus: true,
                    details: {
                        select: {
                            id: true,
                            productId: true,
                            quantity: true,
                            supplierId: true,
                            convertedQuantity: true,
                            suppliedQuantity: true,
                            projectConvertedQuantity: true
                        }
                    }
                }
            });

            if (!goodsIssue) throw new GoodsIssueNotFound();

            if (goodsIssue.fulfillmentStatus?.name === FULFILLMENT_COMPLETE) throw new GoodsIssueFulfillmentCompleteConflict();

            const detailIds = details.map(d => d.id).filter(Boolean);
            const currentDetails = goodsIssue.details.filter(d => detailIds.includes(d.id));
            const currentById = new Map(currentDetails.map(d => [d.id, d]));
            const productIds = [...new Set(currentDetails.map(d => d.productId))];

            const supplierProducts = await findProductsByIds({
                tx,
                where: {
                    productId: { in: productIds }
                },
                select: {
                    id: true,
                    produuctId: true,
                    supplier: true,
                    currentStock: true
                }
            });

            const availableStockByKey = new Map(supplierProducts.map(sp => 
                [buildStockKey(sp.productId, sp.supplierId), Number(sp.currentStock ?? 0)])
            );

            const movementDetails = [];

            for (const detail of details) {

                const current = currentById.get(detail.id);
                if (!current) continue;

                const key = buildStockKey(current.productId, current.supplierId);
                const currentStock = availableStockByKey.get(key) ?? 0;

                const result = buildGoodsIssueDetailUpdate({
                    current,
                    detail,
                    currentStock
                });

                await tx.goodsIssueDetail.update({
                    where: { id: current.id },
                    data: {
                        ...result.updateData,
                        fulfillmentStatus: {
                            connect: { name: result.fulfillmentName }
                        }
                    }
                });

                if (result.movement) movementDetails.push(result.movement);

                availableStockByKey.set(
                    key,
                    result.remainingStock
                );
            }

            if (movementDetails.length) {
                
                await applyInventoryMovement({
                    tx,
                    reference: { goodsIssueId: goodsIssue.id },
                    details: movementDetails,
                    movementType: REFERENCE_MOVEMENT_OUT
                });
            }

            const refreshed = await tx.goodsIssueDetail.findMany({
                where: { goodsIssueId: id },
                select: {
                    isSupplied: true,
                    suppliedQuantity: true
                }
            });

            const fulfillmentName = resolveFulfillmentStatus(refreshed);

            return await tx.goodsIssue.update({
                where: { id },
                data: {
                    fulfillmentStatus: {
                        connect: { name: fulfillmentName }
                    },
                    status: {
                        connect: { name: STATUS_APPROVED }
                    }
                },
                select: {
                    id: true,
                    fulfillmentStatus: true,
                    status: true
                }
            });

        });

    } catch (err) {

        throw new GoodsIssueUpdateDatabaseError();
    }
};