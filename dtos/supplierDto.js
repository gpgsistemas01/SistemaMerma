export const createSupplierDtoForRegister = (body = {}) => ({
    name: body.name.trim(),
    numberphone: body.numberphone?.trim() || null,
    isActive: Boolean(body.isActive)
});