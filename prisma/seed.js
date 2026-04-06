import { prisma } from "../lib/prisma.js";

async function main() {

    await prisma.department.createMany({
        data: [
            { id: '00000000-0000-0000-0000-000000000001', name: 'Sistemas' },
            { id: '00000000-0000-0000-0000-000000000002', name: 'Ventas' },
            { id: '00000000-0000-0000-0000-000000000003', name: 'Diseño' },
            { id: '00000000-0000-0000-0000-000000000004', name: 'Impresión' },
            { id: '00000000-0000-0000-0000-000000000005', name: 'Router' },
            { id: '00000000-0000-0000-0000-000000000006', name: 'Taller 3d' },
            { id: '00000000-0000-0000-0000-000000000007', name: 'Herrería' },
            { id: '00000000-0000-0000-0000-000000000008', name: 'Acabados' },
            { id: '00000000-0000-0000-0000-000000000009', name: 'PT' },
            { id: '00000000-0000-0000-0000-000000000010', name: 'Tráfico' },
            { id: '00000000-0000-0000-0000-000000000011', name: 'Instalaciones' },
            { id: '00000000-0000-0000-0000-000000000012', name: 'Almacén' }
        ],
        skipDuplicates: true
    });

    await prisma.role.createMany({
        data: [
            { id: '00000000-0000-0000-0000-000000000020', name: 'Administrador del sistema' },
            { id: '00000000-0000-0000-0000-000000000021', name: 'Coordinador' },
            { id: '00000000-0000-0000-0000-000000000022', name: 'Auxiliar' },
            { id: '00000000-0000-0000-0000-000000000023', name: 'Operador' },
            { id: '00000000-0000-0000-0000-000000000024', name: 'Instalador' },
            { id: '00000000-0000-0000-0000-000000000025', name: 'Diseñador' },
            { id: '00000000-0000-0000-0000-000000000026', name: 'Almacenista' },
        ],
        skipDuplicates: true
    });

    await prisma.status.createMany({
        data: [
            { id: '00000000-0000-0000-0000-000000000030', name: 'Abierta' },
            { id: '00000000-0000-0000-0000-000000000031', name: 'Cerrada' },
            { id: '00000000-0000-0000-0000-000000000032', name: 'Aprobada' },
            { id: '00000000-0000-0000-0000-000000000033', name: 'Rechazada' },
            { id: '00000000-0000-0000-0000-000000000034', name: 'Confirmada' },
            { id: '00000000-0000-0000-0000-000000000035', name: 'Cancelada' },
        ],
        skipDuplicates: true
    });

    // const hashedPassword = await bcrypt.hash('A%54321', 10)

    await prisma.user.upsert({
        where: {
            name: 'Soporte01',
        },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000040',
            name: 'Soporte01',
            password: 'A%54321',
            isActive: true,
            departmentId: '00000000-0000-0000-0000-000000000001',
            roleId: '00000000-0000-0000-0000-000000000020'
        },
    });

    await prisma.user.createMany({
        data: [
            { id: '00000000-0000-0000-0000-000000000041', name: 'Coordinador02', password: '12345', departmentId: '00000000-0000-0000-0000-000000000012', roleId: '00000000-0000-0000-0000-000000000021' },
            { id: '00000000-0000-0000-0000-000000000042', name: 'Almacenista01', password: '12345', departmentId: '00000000-0000-0000-0000-000000000012', roleId: '00000000-0000-0000-0000-000000000026' },
            { id: '00000000-0000-0000-0000-000000000043', name: 'Auxiliar02', password: '12345', departmentId: '00000000-0000-0000-0000-000000000012', roleId: '00000000-0000-0000-0000-000000000022' },
        ],
        skipDuplicates: true
    })

    await prisma.category.createMany({
        data: [
            { name: 'Flexibles' },
            { name: 'Rígidos' },
            { name: 'Papel' }
        ],
        skipDuplicates: true
    });

    await prisma.uoM.createMany({
        data: [
            { name: 'litros', abbrevation: 'L' },
            { name: 'metros', abbrevation: 'm' },
            { name: 'milimetros', abbrevation: 'mm' }
        ],
        skipDuplicates: true
    });

    await prisma.referenceNumberCounter.createMany({
        data: [
            { prefix: 'REC' },
            { prefix: 'SAL'},
            { prefix: 'REQ' },
        ],
        skipDuplicates: true
    });

    await prisma.supplier.createMany({
        data: [
            { name: 'Proveedor 1' },
            { name: 'Proveedor 2' },
        ],
        skipDuplicates: true
    });

    const uoms = await prisma.uoM.findMany();

    const categories = await prisma.category.findMany();

    await prisma.product.createMany({
        data: [
            { name: 'Producto 1', unitCost: 2, currentStock: 2, minStock: 3, maxStock: 8, categoryId: categories[0].id, uomId: uoms[0].id },
            { name: 'Producto 2', unitCost: 4, currentStock: 3, minStock: 60, maxStock: 80, categoryId: categories[1].id, uomId: uoms[1].id },
        ],
        skipDuplicates: true
    });

    await prisma.profile.deleteMany();

    await prisma.user.update({
        where: { id: '00000000-0000-0000-0000-000000000041' },
        data: {
            profiles: {
                create: [
                    { name: 'Carlos', lastName: 'Hernandez' }
                ]
            }
        }
    });

    await prisma.user.update({
        where: { id: '00000000-0000-0000-0000-000000000042' },
        data: {
            profiles: {
                create: [
                    { name: 'Anastacia', lastName: 'Bustamante' }
                ]
            }
        }
    });

    await prisma.user.update({
        where: { id: '00000000-0000-0000-0000-000000000042' },
        data: {
            profiles: {
                create: [
                    { name: 'Miguel', lastName: 'Palacios' }
                ]
            }
        }
    });
}

main().finally(() => {
    prisma.$disconnect();
});