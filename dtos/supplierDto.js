export const createSupplierDtoForRegister = (body = {}) => ({
    name: body.name,
    numberphone: body.numberphone,
    isActive: body.isActive
});