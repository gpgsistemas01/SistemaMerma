import { prisma } from "../lib/prisma.js";

export const getDepartmentById = async (id) => {

    const department = await prisma.department.findFirst({
        where: {
            id: id
        }
    });

    return department ? department.name : null;
}