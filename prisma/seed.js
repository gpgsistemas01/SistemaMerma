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
            { id: '00000000-0000-0000-0000-000000000030', name: 'Activo' },
            { id: '00000000-0000-0000-0000-000000000031', name: 'Inactivo' },
            { id: '00000000-0000-0000-0000-000000000032', name: 'Abierta' },
            { id: '00000000-0000-0000-0000-000000000033', name: 'Cerrada' },
            { id: '00000000-0000-0000-0000-000000000034', name: 'Aprobada' },
            { id: '00000000-0000-0000-0000-000000000035', name: 'Rechazada' },
            { id: '00000000-0000-0000-0000-000000000036', name: 'Confirmada' },
            { id: '00000000-0000-0000-0000-000000000037', name: 'Cancelada' },
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
            id: '00000000-0000-0000-0000-000000000041',
            name: 'Soporte01',
            password: 'A%54321',
            statusId: '00000000-0000-0000-0000-000000000030',
            departmentId: '00000000-0000-0000-0000-000000000001',
            roleId: '00000000-0000-0000-0000-000000000020'
        },
    });

    await prisma.category.createMany({
        data: [
            { id: '00000000-0000-0000-0000-000000000051', name: 'Flexibles' },
            { id: '00000000-0000-0000-0000-000000000052', name: 'Rígidos' },
            { id: '00000000-0000-0000-0000-000000000053', name: 'Papel' }
        ],
        skipDuplicates: true
    });

    await prisma.uoM.createMany({
        data: [
            { id: '00000000-0000-0000-0000-000000000061', name: 'litros', abbrevation: 'L' },
            { id: '00000000-0000-0000-0000-000000000062', name: 'metros', abbrevation: 'm' },
            { id: '00000000-0000-0000-0000-000000000063', name: 'milimetros', abbrevation: 'mm' }
        ],
        skipDuplicates: true
    });
}

main().finally(() => {
    prisma.$disconnect();
});