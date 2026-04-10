export const createGoodsIssueDtoForRegister = (body = {}) => ({
    requesterId: body.requesterId.trim(),
    projectId: body.projectId.trim(),
    requestDate: new Date(body.requestDate),
    observations: body.observations?.trim() || null,
    details: (body.details).map(d => ({
        productId: d.productId.trim(),
        quantity: Number(d.quantity)
    }))
});
