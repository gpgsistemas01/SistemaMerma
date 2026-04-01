import { prisma } from "../lib/prisma.js";

export const getRoleNameById = async (id) => {

    const role = await prisma.role.findFirst({
        where: {
            id: id
        },
    });

    return role ? role.name : null;
}