import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ClientCreateDatabaseError, ClientFindDatabaseError, ClientNotFound } from '../../../src/errors/sales/clientError.js';

const clientCreate = vi.fn();
const clientUpdate = vi.fn();
const clientFindFirst = vi.fn();


vi.mock('../../../src/utils/logger.js', () => ({
  createServiceLogger: () => ({}),
  getModelLogContext: (_model, data = {}) => data,
  logServiceError: vi.fn(),
  logServiceInfo: vi.fn()
}));

vi.mock('../../../src/repository/baseRepository.js', () => ({
  getDb: () => ({
    client: {
      create: clientCreate,
      update: clientUpdate,
      findFirst: clientFindFirst
    }
  })
}));

const {
  createClient,
  findClientById,
  updateClient
} = await import('../../../src/services/sales/clientService.js');

describe('clientService submit operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('crea clientes usando los datos del submit', async () => {
    const clientDto = { name: 'Cliente Uno', advisorId: 'advisor-1' };
    const createdClient = { id: 'client-1', ...clientDto };

    clientCreate.mockResolvedValue(createdClient);

    await expect(createClient({ clientDto })).resolves.toEqual(createdClient);
    expect(clientCreate).toHaveBeenCalledWith({ data: clientDto });
  });

  it('envuelve errores de creación en ClientCreateDatabaseError', async () => {
    clientCreate.mockRejectedValue(new Error('db failed'));

    await expect(createClient({ clientDto: { name: 'Cliente Uno' } })).rejects.toThrow(ClientCreateDatabaseError);
  });

  it('actualiza clientes usando id y datos del submit', async () => {
    const clientDto = { name: 'Cliente Actualizado' };
    const updatedClient = { id: 'client-1', ...clientDto };

    clientUpdate.mockResolvedValue(updatedClient);

    await expect(updateClient({ id: 'client-1', clientDto })).resolves.toEqual(updatedClient);
    expect(clientUpdate).toHaveBeenCalledWith({
      where: { id: 'client-1' },
      data: clientDto
    });
  });

  it('traduce P2025 a ClientNotFound al actualizar', async () => {
    clientUpdate.mockRejectedValue({ code: 'P2025' });

    await expect(updateClient({ id: 'missing-client', clientDto: { name: 'Cliente' } })).rejects.toThrow(ClientNotFound);
  });

  it('envuelve otros errores de actualización en ClientFindDatabaseError', async () => {
    clientUpdate.mockRejectedValue(new Error('db failed'));

    await expect(updateClient({ id: 'client-1', clientDto: { name: 'Cliente' } })).rejects.toThrow(ClientFindDatabaseError);
  });

  it('falla con ClientNotFound si no existe el cliente solicitado', async () => {
    clientFindFirst.mockResolvedValue(null);

    await expect(findClientById({ id: 'missing-client' })).rejects.toThrow(ClientNotFound);
  });
});
