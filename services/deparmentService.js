import { prisma } from "../lib/prisma.js";

export const getDepartmentById = async (id) => {

    const department = await prisma.department.findFirst({
        where: {
            id: id
        }
    });

    return department ? department.name : null;
}

export const getAllDepartmentIds = async () => {

    const departments = await prisma.department.findMany({
        select: {
            id: true
        }
    });
    return departments;
}

export const getDepartmentWarehouseId = async () => {

    const warehouseDepartment = await prisma.department.findFirst({
        where: {
            name: 'Almacén'
        },
        select: {
            id: true
        }
    });
    
    return warehouseDepartment ? warehouseDepartment.id : null;
}