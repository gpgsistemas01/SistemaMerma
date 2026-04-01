import { encryptPassword } from "../utils/encryptionUtils.js";
import { prisma } from "../lib/prisma.js";

export const saveUser = async (userDto) => {

    return prisma.user.create({
        data: userDto
    });
}

export const getUserIdByLogin = async (name, password) => {

    const user = await prisma.user.findUnique({
        where: {
            name: name,
            password: password
        },
        select: {
            id: true,
        }
    });

    return user ? user.id : null;
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

export const editPasswordByUserId = async (userId, password) => {

    const hashedPassword = await encryptPassword(password);

    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            password: hashedPassword
        }
    });
}