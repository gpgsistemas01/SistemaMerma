import XLSX from 'xlsx';
import { prisma } from '../lib/prisma.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const filePath = path.join(__dirname, 'inventario_BD.xlsx')
if (!fs.existsSync(filePath)) {
  console.log('No se encontró el archivo')
}

const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]]
const rows = XLSX.utils.sheet_to_json(sheet, {
    defval: null,
});

const toDecimal = (value) =>
    value !== null && value !== '' ? parseFloat(value) : null
const parsed = rows.map(row => ({
    name: row.name,
    sku: row.sku,
    unitCost: toDecimal(row.unitCost),
    currentStock: toDecimal(row.currentStock) ?? 0,
    unitMeasure: row.unitMeasure,
    minStock: toDecimal(row.minStock),
    base: toDecimal(row.base),
    height: toDecimal(row.height),
    weigthedM2: toDecimal(row.weigthedM2)
}))

await prisma.product.createMany({
    data: parsed,
});