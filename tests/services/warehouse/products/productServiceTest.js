import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductNotFound, ProductStockAdjustmentDatabaseError } from '../../../../src/errors/warehouse/productError.js';

const createStockAdjustment = vi.fn();

vi.mock('../../../../src/utils/logger.js', () => ({
  createServiceLogger: () => ({}),
  getModelLogContext: (_model, data = {}) => data,
  logServiceError: vi.fn(),
  logServiceInfo: vi.fn()
}));

vi.mock('../../../../src/repository/baseRepository.js', () => ({
  getDb: () => ({})
}));

vi.mock('../../../../src/services/warehouse/adjustmentService.js', () => ({
  createStockAdjustment
}));

vi.mock('../../../../src/services/warehouse/products/productHelpers.js', () => ({
  prepareProductData: vi.fn(),
  withRetry: vi.fn(async (fn) => fn())
}));

vi.mock('../../../../src/services/warehouse/products/productRelations.js', () => ({
  syncSupplierProduct: vi.fn()
}));

vi.mock('../../../../src/services/warehouse/products/supplierProductService.js', () => ({
  findAllSupplierProducts: vi.fn(),
  findCurrentSupplierProductByProductId: vi.fn(),
  findSupplierProductByIds: vi.fn(),
  recalculateConvertedQuantityByProduct: vi.fn()
}));

const { updateProductStock } = await import('../../../../src/services/warehouse/products/productService.js');

describe('productService submit operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('delega el submit de ajuste de stock a createStockAdjustment', async () => {
    const productDto = {
      supplierId: 'supplier-1',
      reasonId: 'reason-1',
      observations: 'Ajuste por conteo',
      newStock: 25
    };
    const adjustment = { id: 'adjustment-1', productId: 'product-1' };

    createStockAdjustment.mockResolvedValue(adjustment);

    await expect(updateProductStock({ id: 'product-1', userId: 'user-1', productDto })).resolves.toEqual(adjustment);
    expect(createStockAdjustment).toHaveBeenCalledWith({
      productId: 'product-1',
      supplierId: 'supplier-1',
      reasonId: 'reason-1',
      observations: 'Ajuste por conteo',
      newStock: 25,
      userId: 'user-1'
    });
  });

  it('traduce P2025 a ProductNotFound durante el ajuste de stock', async () => {
    createStockAdjustment.mockRejectedValue({ code: 'P2025' });

    await expect(updateProductStock({
      id: 'missing-product',
      userId: 'user-1',
      productDto: { supplierId: 'supplier-1', reasonId: 'reason-1', newStock: 0 }
    })).rejects.toThrow(ProductNotFound);
  });

  it('envuelve otros errores de ajuste de stock en ProductStockAdjustmentDatabaseError', async () => {
    createStockAdjustment.mockRejectedValue(new Error('db failed'));

    await expect(updateProductStock({
      id: 'product-1',
      userId: 'user-1',
      productDto: { supplierId: 'supplier-1', reasonId: 'reason-1', newStock: 0 }
    })).rejects.toThrow(ProductStockAdjustmentDatabaseError);
  });
});
