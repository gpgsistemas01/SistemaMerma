import { prisma, Presentation } from "../lib/prisma.js";
import XLSX from 'xlsx';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const getPresentation = (value) => {
    if (!value) return null;

    if (value === 'ROLLO') return Presentation.ROLLO;
    if (value === 'CARTUCHO') return Presentation.CARTUCHO;
    if (value === 'HOJA') return Presentation.HOJA;
    if (value === 'LT1') return Presentation.LT1;
    if (value === 'LT3') return Presentation.LT3;
    if (value === 'LT5') return Presentation.LT5;
    if (value === 'ML775') return Presentation.ML775;
    if (value === 'OJILLOS') return Presentation.OJILLOS;
    if (value === 'PIEZA') return Presentation.PIEZA;
}

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

    const soporte = await prisma.user.findUnique({
        where: { name: 'Soporte01' }
        });

        await prisma.user.update({
            where: { id: soporte.id },
            data: {
                profiles: {
                    create: [
                        {
                            name: 'Administrador',
                            lastName: 'Sistema'
                        }
                    ]
                }
            }
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
                password: 'A%54321',
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

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, 'inventario_BD.xlsx');

    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, {
        defval: null,
    });

    const toDecimal = (value) => value !== null && value !== '' ? parseFloat(value) : null;
    const parsed = rows.map(row => ({
        name: row.name,
        sku: row.sku,
        unitCost: toDecimal(row.unitCost),
        currentStock: toDecimal(row.currentStock) ?? 0,
        presentation: getPresentation(row.presentation),
        minStock: toDecimal(row.minStock),
        base: toDecimal(row.base),
        height: toDecimal(row.height),
        weigthedM2: toDecimal(row.weigthedM2)
    }));

    await prisma.product.createMany({
        data: parsed,
        skipDuplicates: true
    });
}

main().finally(() => {
    prisma.$disconnect();
});
