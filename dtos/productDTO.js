export const createProductDtoForRegister = (body = {}) => ({
    name: body.name.trim(),
    unitCost: body.unitCost ? Number(body.unitCost) : null,
    minStock: Number(body.minStock),
    base: body.base ? Number(body.base) : null,
    height: body.height ? Number(body.height) : null,
    isActive: Boolean(body.isActive)
});