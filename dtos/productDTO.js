export const createProductDtoForRegister = (body = {}) => ({
    categoryId: body.categoryId,
    uomId: body.uomId,
    name: body.name,
    unitCost: body.unitCost,
    currentStock: body.currentStock,
    minStock: body.minStock,
    maxStock: body.maxStock,
    expiryDate: body.expiryDate,
    thickness: body.thickness,
    base: body.base,
    height: body.height,
    color: body.color,
    type: body.type,
    presentation: body.presentation,
    isActive: body.isActive
});