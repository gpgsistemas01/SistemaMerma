export const createProductDtoForRegister = (body = {}) => ({
    name: body.name.trim(),
    supplierId: body.supplierId,
    presentationId: body.presentationId,
    unitMeasureId: body.unitMeasureId,
    minStock: Number(body.minStock),
    base: body.base ? Number(body.base) : null,
    height: body.height ? Number(body.height) : null,
    ...(Object.prototype.hasOwnProperty.call(body, 'isActive') ? { isActive: Boolean(body.isActive) } : {})
});
