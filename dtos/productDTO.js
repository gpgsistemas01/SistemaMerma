export const createProductDtoForRegister = (body = {}) => ({
    categoryId: body.categoryId.trim(),
    uomId: body.uomId.trim(),
    name: body.name.trim(),
    unitCost: Number(body.unitCost),
    currentStock: body.currentStock ? Number(body.currentStock) : 0,
    minStock: Number(body.minStock),
    maxStock: Number(body.maxStock),
    expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
    thickness: body.thickness ? Number(body.thickness) : null,
    base: body.base ? Number(body.base) : null,
    height: body.height ? Number(body.height) : null,
    color: body.color?.trim() || null,
    type: body.type?.trim() || null,
    presentation: body.presentation?.trim() || null,
    isActive: Boolean(body.isActive)
});