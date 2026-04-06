export const createPurchaseRequisitionDtoForRegister = (body = {}) => ({
    projectId: body.projectId.trim(),
    requesterId: body.requesterId.trim(),
    requestDate: new Date(body.requestDate),
    observations: body.observations?.trim() || null,
    details: body.details.map(d => ({
        productId: d.productId.trim(),
        quantity: Number(d.quantity),
        description: d.description?.trim() || null
    }))
});
