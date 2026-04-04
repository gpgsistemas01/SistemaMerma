import { SupplierNotFound } from "../../errors/warehouse/supplierError.js";
import { prisma } from "../../lib/prisma.js";

export const findAllSuppliers = async ({
    skip = 0,
    take = 10,
    search = '',
    orderBy = 'name',
    orderDir = 'asc'
}) => {

    const where = search
        ? {
            name: {
                contains: search,
                mode: 'insensitive'
            }
        }
        : {};

    const suppliers = await prisma.supplier.findMany({
        skip,
        take,
        where,
        orderBy: {
            [orderBy]: orderDir
        }
    });

    const total = await prisma.supplier.count();
    const filtered = await prisma.supplier.count({ where });

    return {
        data: suppliers,
        recordsTotal: total,
        recordsFiltered: filtered
    };
};

export const createSupplier = async (supplierDto) => {

    const supplier = await prisma.supplier.create({
        data: {
            name: supplierDto.name,
            numberphone: supplierDto.numberphone,
            isActive: supplierDto.isActive
        }
    });

    return supplier;
}

export const updateSupplier = async (supplierDto, id) => {

    try {

        const supplier = await prisma.supplier.update({
            data: {
                name: supplierDto.name,
                numberphone: supplierDto.numberphone,
                isActive: supplierDto.isActive
            },
            where: {
                id: id
            }
        });

        return supplier;

    } catch (err) {

        if (err.code === 'P2025') throw SupplierNotFound();

        throw err;
    }
}