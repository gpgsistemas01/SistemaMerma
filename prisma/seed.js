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
            { id: '00000000-0000-0000-0000-000000000027', name: 'Vendedor' },
            { id: '00000000-0000-0000-0000-000000000028', name: 'Repartidor' },
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

    const departamentos = await prisma.department.findMany({
        select: { id: true, name: true },
        orderBy: { id: 'asc' }
    });
    const roles = await prisma.role.findMany({
        select: { id: true, name: true }
    });
    const roleByName = Object.fromEntries(roles.map((role) => [role.name, role.id]));

    const usersSeed = [];

    for (const [index, departamento] of departamentos.entries()) {
        const safeName = departamento.name.toLowerCase().replace(/\s+/g, '_');
        const numero = String(index + 1).padStart(2, '0');
        const isVentas = departamento.name === 'Ventas';
        const isDiseno = departamento.name === 'Diseño';
        const isInstalaciones = departamento.name === 'Instalaciones';
        const isPt = departamento.name === 'PT';

        let roleName = 'Operador';
        if (isVentas) roleName = 'Vendedor';
        if (isDiseno) roleName = 'Diseñador';
        if (isInstalaciones) roleName = 'Instalador';
        if (isPt) roleName = 'Repartidor';

        usersSeed.push(
            {
                name: `coord_${safeName}_${numero}`,
                password: '12345',
                departmentId: departamento.id,
                roleId: roleByName['Coordinador'],
                profileName: `Coordinador ${departamento.name}`,
                profileLastName: 'General'
            },
            {
                name: `${safeName}_${numero}_${roleName.toLowerCase()}`,
                password: '12345',
                departmentId: departamento.id,
                roleId: roleByName[roleName],
                profileName: roleName,
                profileLastName: departamento.name
            }
        );

        if (!isVentas && !isDiseno) {
            usersSeed.push({
                name: `${safeName}_${numero}_auxiliar`,
                password: '12345',
                departmentId: departamento.id,
                roleId: roleByName['Auxiliar'],
                profileName: 'Auxiliar',
                profileLastName: departamento.name
            });
        }
    }

    for (const userSeed of usersSeed) {
        await prisma.user.upsert({
            where: { name: userSeed.name },
            update: {
                password: userSeed.password,
                departmentId: userSeed.departmentId,
                roleId: userSeed.roleId,
                isActive: true
            },
            create: {
                name: userSeed.name,
                password: userSeed.password,
                departmentId: userSeed.departmentId,
                roleId: userSeed.roleId,
                isActive: true
            }
        });
    }

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
            { name: 'Producto 3', unitCost: 7, currentStock: 10, minStock: 2, maxStock: 20, categoryId: categories[2].id, uomId: uoms[2].id },
        ],
        skipDuplicates: true
    });

    for (const userSeed of usersSeed) {
        await prisma.user.update({
            where: { name: userSeed.name },
            data: {
                profiles: {
                    create: [
                        { name: userSeed.profileName, lastName: userSeed.profileLastName }
                    ]
                }
            }
        });
    }

    const productos = await prisma.product.findMany({
        where: { name: { in: ['Producto 1', 'Producto 2', 'Producto 3'] } },
        orderBy: { name: 'asc' }
    });
    const proveedor = await prisma.supplier.findFirst({ where: { name: 'Proveedor 1' } });
    const estatusAbierta = await prisma.status.findFirst({ where: { name: 'Abierta' } });
    const perfilAlmacenista = await prisma.profile.findFirst({
        where: {
            users: {
                some: {
                    department: {
                        name: 'Almacén'
                    }
                }
            }
        },
        orderBy: { name: 'asc' }
    });
    const perfilAprobador = await prisma.profile.findFirst({
        where: {
            users: {
                some: {
                    department: { name: 'Almacén' },
                    role: { name: 'Coordinador' }
                }
            }
        }
    });
    const perfilSolicitante = await prisma.profile.findFirst({
        where: {
            users: {
                some: {
                    department: {
                        name: {
                            notIn: ['Ventas', 'Diseño']
                        }
                    }
                }
            }
        },
        orderBy: { name: 'asc' }
    });

    await prisma.project.upsert({
        where: { referenceNumber: 'PROY-001' },
        update: {},
        create: {
            referenceNumber: 'PROY-001',
            client: 'Cliente Demo',
            name: 'Proyecto Demo',
            date: new Date('2026-04-01T00:00:00.000Z')
        }
    });

    const proyectoDemo = await prisma.project.findUnique({
        where: { referenceNumber: 'PROY-001' }
    });

    if (
        proveedor &&
        estatusAbierta &&
        perfilAlmacenista &&
        perfilSolicitante &&
        perfilAprobador &&
        proyectoDemo &&
        productos.length >= 2
    ) {
        await prisma.goodsReceipt.upsert({
            where: { referenceNumber: 'REC-0001' },
            update: {
                details: {
                    deleteMany: {},
                    create: [
                        { productId: productos[0].id, quantity: 5, description: 'Recepción de prueba 1' },
                        { productId: productos[1].id, quantity: 8, description: 'Recepción de prueba 2' },
                    ]
                }
            },
            create: {
                referenceNumber: 'REC-0001',
                supplierId: proveedor.id,
                receptionDate: new Date('2026-04-02T00:00:00.000Z'),
                observations: 'Recepción inicial de materiales',
                statusId: estatusAbierta.id,
                departmentId: '00000000-0000-0000-0000-000000000012',
                receivedById: perfilAlmacenista.id,
                details: {
                    create: [
                        { productId: productos[0].id, quantity: 5, description: 'Recepción de prueba 1' },
                        { productId: productos[1].id, quantity: 8, description: 'Recepción de prueba 2' },
                    ]
                }
            }
        });

        await prisma.purchaseRequisition.upsert({
            where: { referenceNumber: 'REQ-0001' },
            update: {
                details: {
                    deleteMany: {},
                    create: [
                        { productId: productos[0].id, quantity: 2, description: 'Requisición de prueba 1' },
                        { productId: productos[1].id, quantity: 1, description: 'Requisición de prueba 2' },
                        ...(productos[2]
                            ? [{ productId: productos[2].id, quantity: 3, description: 'Requisición de prueba 3' }]
                            : []),
                    ]
                }
            },
            create: {
                referenceNumber: 'REQ-0001',
                requestDate: new Date('2026-04-03T00:00:00.000Z'),
                observations: 'Requisición inicial de materiales',
                status: {
                    connect: { id: "00000000-0000-0000-0000-000000000030" }
                },
                department: {
                    connect: { id: "00000000-0000-0000-0000-000000000012" }
                },
                approver: {
                    connect: { id: perfilAprobador.id }
                },
                requester: {
                    connect: { id: perfilSolicitante.id }
                },
                project: {
                    connect: { id: proyectoDemo.id }
                },
                details: {
                    create: [
                        { productId: productos[0].id, quantity: 2, description: 'Requisición de prueba 1' },
                        { productId: productos[1].id, quantity: 1, description: 'Requisición de prueba 2' },
                        ...(productos[2]
                            ? [{ productId: productos[2].id, quantity: 3, description: 'Requisición de prueba 3' }]
                            : []),
                    ]
                }
            }
        });
    }
}

main().finally(() => {
    prisma.$disconnect();
});
