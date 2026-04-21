export const createSupplierDtoForRegister = (body = {}) => ({
    legalName: body.legalName.trim(),
    tradeName: body.tradeName.trim(),
    numberphone: body.numberphone?.trim() || null,
    isActive: Boolean(body.isActive)
});
