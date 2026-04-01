import { encryptPassword } from "../utils/encryptionUtils.js";

export const createUserDtoForRegister = async (body = {}) => ({

    username: body.username,
    roleId: body.roleId,
    departmentId: body.departmentId,
    password: await encryptPassword(body.password)

});

export const createUserDtoForToken = (id) => ({

    id

});