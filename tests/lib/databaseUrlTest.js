import { afterEach, describe, expect, it, vi } from 'vitest';

import { getDatabaseUrl, resolveDatabaseUrl } from '../../src/lib/databaseUrl.js';

describe('databaseUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('permite usar una URL de pruebas únicamente cuando se pasa como parámetro', () => {
    expect(resolveDatabaseUrl({
      databaseUrl: 'postgresql://test-db'
    })).toBe('postgresql://test-db');
  });

  it('mantiene DATABASE_URL como primera opción fuera de pruebas', () => {
    expect(resolveDatabaseUrl({
      databaseUrl: 'postgresql://app-db',
      databaseUrlDirect: 'postgresql://direct-db'
    })).toBe('postgresql://app-db');
  });

  it('permite usar DATABASE_URL_DIRECT y DIRECT_URL como compatibilidad fuera de pruebas', () => {
    expect(resolveDatabaseUrl({
      databaseUrlDirect: 'postgresql://legacy-direct-db',
      directUrl: 'postgresql://direct-db'
    })).toBe('postgresql://legacy-direct-db');
  });

  it('no lee DATABASE_TEST_URL desde variables de entorno reales', () => {
    vi.stubEnv('DATABASE_URL', 'postgresql://env-app-db');
    vi.stubEnv('DATABASE_TEST_URL', 'postgresql://env-test-db');
    vi.stubEnv('DATABASE_URL_DIRECT', 'postgresql://direct-db');
    vi.stubEnv('DIRECT_URL', 'postgresql://legacy-direct-db');

    expect(getDatabaseUrl()).toBe('postgresql://env-app-db');
  });

  it('lee DATABASE_URL desde variables de entorno reales fuera de pruebas', () => {
    vi.stubEnv('DATABASE_URL', 'postgresql://env-app-db');
    vi.stubEnv('DATABASE_TEST_URL', 'postgresql://env-test-db');

    expect(getDatabaseUrl()).toBe('postgresql://env-app-db');
  });

  it('falla explícitamente con DATABASE_URL si process.env no tiene URL de producción configurada', () => {
    vi.stubEnv('DATABASE_URL', '');
    vi.stubEnv('DATABASE_TEST_URL', 'postgresql://env-test-db');
    vi.stubEnv('DATABASE_URL_DIRECT', '');
    vi.stubEnv('DIRECT_URL', '');

    expect(() => getDatabaseUrl()).toThrow(/DATABASE_URL/);
  });
});
