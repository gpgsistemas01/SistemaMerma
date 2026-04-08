export const createProductConsumptionDtoForRegister = (body = {}) => ({
    requesterId: body.requesterId.trim(),
    projectId: body.projectId.trim(),
    machineId: body.machineId.trim(),
    requestDate: new Date(body.requestDate),
    details: (body.details || []).map(d => ({
        productId: d.productId.trim(),
        goodsIssueId: d.goodsIssueId.trim(),
        consumedSquareMeters: Number(d.consumedSquareMeters)
    }))
});
