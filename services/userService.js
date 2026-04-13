import { prisma } from "../lib/prisma.js";

export const getUserIdByLogin = async (name, password) => {

    const user = await prisma.user.findUnique({
        where: {
            name: name,
        },
        select: {
            id: true,
            password: true
        }
    });

    if (!user) return null;

    if (password !== user.password) return null;

    return user.id;
}

export const getLoggedUser = async (userId) => {

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            name: true,
            role: {
                select: {
                    id: true,
                    name: true,
                }
            },
            department: {
                select: {
                    id: true,
                    name: true,
                }
            },
        }
    });

    return user ? {
        id: user.id,
        departmentId: user.department.id,
        department: user.department.name,
        roleId: user.role.id,
        role: user.role.name,
        name: user.name
    } : null;
}
