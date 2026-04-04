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
            name: true,
            role: {
                select: {
                    name: true,
                }
            },
            department: {
                select: {
                    name: true,
                }
            },
        }
    });

    return user ? {
        department: user.department.name,
        role: user.role.name,
        name: user.name
    } : null;
}