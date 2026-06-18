import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SupplierCreateDatabaseError, SupplierNotFound, SupplierUpdateDatabaseError } from '../../../src/errors/warehouse/supplierError.js';

const referenceNumberUpdate = vi.fn();
const supplierCreate = vi.fn();
const supplierFindUnique = vi.fn();
const supplierUpdate = vi.fn();
const transaction = vi.fn(async (callback) => callback({
  referenceNumberCounter: {
    update: referenceNumberUpdate
  },
  supplier: {
    create: supplierCreate
  }
}));


vi.mock('../../../src/utils/logger.js', () => ({
  createServiceLogger: () => ({}),
  getModelLogContext: (_model, data = {}) => data,
  logServiceError: vi.fn(),
  logServiceInfo: vi.fn()
}));

vi.mock('../../../src/repository/baseRepository.js', () => ({
  getDb: () => ({
    $transaction: transaction,
    supplier: {
      findUnique: supplierFindUnique,
      update: supplierUpdate
    }
  })
}));

const {
  createSupplier,
  updateSupplier
} = await import('../../../src/services/warehouse/supplierService.js');

describe('supplierService submit operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    transaction.mockImplementation(async (callback) => callback({
      referenceNumberCounter: {
        update: referenceNumberUpdate
      },
      supplier: {
        create: supplierCreate
      }
    }));
  });

  it('crea proveedores en transacción y genera código desde el contador', async () => {
    const supplierDto = { tradeName: 'Proveedor Uno', legalName: 'Proveedor Uno SA' };
    const createdSupplier = { id: 'supplier-1', ...supplierDto, codeNumber: 27, code: 'AA' };

    referenceNumberUpdate.mockResolvedValue({ counter: 27 });
    supplierCreate.mockResolvedValue(createdSupplier);

    await expect(createSupplier(supplierDto)).resolves.toEqual(createdSupplier);
    expect(transaction).toHaveBeenCalledTimes(1);
    expect(referenceNumberUpdate).toHaveBeenCalledWith({
      where: {
        prefix_year: {
          prefix: 'PRO',
          year: 0
        }
      },
      data: {
        counter: {
          increment: 1
        }
      }
    });
    expect(supplierCreate).toHaveBeenCalledWith({
      data: {
        ...supplierDto,
        codeNumber: 27,
        code: 'AA'
      }
    });
  });

  it('envuelve errores de creación en SupplierCreateDatabaseError', async () => {
    transaction.mockRejectedValue(new Error('db failed'));

    await expect(createSupplier({ tradeName: 'Proveedor Uno' })).rejects.toThrow(SupplierCreateDatabaseError);
  });

  it('actualiza proveedores existentes usando los datos del submit', async () => {
    const supplierDto = { tradeName: 'Proveedor Actualizado' };
    const updatedSupplier = { id: 'supplier-1', ...supplierDto };

    supplierFindUnique.mockResolvedValue({ id: 'supplier-1' });
    supplierUpdate.mockResolvedValue(updatedSupplier);

    await expect(updateSupplier(supplierDto, 'supplier-1')).resolves.toEqual(updatedSupplier);
    expect(supplierFindUnique).toHaveBeenCalledWith({
      where: { id: 'supplier-1' },
      select: { id: true }
    });
    expect(supplierUpdate).toHaveBeenCalledWith({
      data: supplierDto,
      where: { id: 'supplier-1' }
    });
  });

  it('falla con SupplierNotFound si se intenta actualizar un proveedor inexistente', async () => {
    supplierFindUnique.mockResolvedValue(null);

    await expect(updateSupplier({ tradeName: 'Proveedor' }, 'missing-supplier')).rejects.toThrow(SupplierNotFound);
    expect(supplierUpdate).not.toHaveBeenCalled();
  });

  it('envuelve errores de actualización en SupplierUpdateDatabaseError', async () => {
    supplierFindUnique.mockResolvedValue({ id: 'supplier-1' });
    supplierUpdate.mockRejectedValue(new Error('db failed'));

    await expect(updateSupplier({ tradeName: 'Proveedor' }, 'supplier-1')).rejects.toThrow(SupplierUpdateDatabaseError);
  });
});
