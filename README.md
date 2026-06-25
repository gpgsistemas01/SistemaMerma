# SistemaMerma

## Base de datos para pruebas automatizadas

La aplicación resuelve la cadena de conexión con `src/lib/databaseUrl.js`:

- En ejecución normal se usa `DATABASE_URL` como primera opción.
- `DATABASE_TEST_URL` no se lee automáticamente desde el resolver compartido.
- La URL de pruebas solo debe inyectarse desde la carpeta `tests`, pasando esa URL como parámetro o asignándola allí a `DATABASE_URL` antes de importar el cliente Prisma.
- Fuera de `tests`, `DATABASE_URL_DIRECT` y `DIRECT_URL` se mantienen como compatibilidad si todavía existen en algún entorno.

### Criterio de selección

`resolveDatabaseUrl` recibe una opción `databaseUrl` explícita para los casos en que una prueba necesita usar una base aislada. Si no recibe parámetros, toma directamente las URLs reales del proceso y prioriza la URL de producción (`DATABASE_URL`).

Ejemplo de variables locales:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/sistema_merma"
DATABASE_TEST_URL="postgresql://usuario:password@localhost:5432/sistema_merma_test"
```

## Conexión Prisma en pruebas

Se mantiene un solo punto de creación de cliente Prisma en `src/lib/prisma.js`. No se crea un segundo cliente para pruebas: antes de importar el cliente dentro de `tests`, `tests/setupTestDatabaseEnv.js` valida `DATABASE_TEST_URL` y la asigna a `DATABASE_URL` para que el mismo resolver reciba la URL de pruebas desde la carpeta de tests.

Las pruebas que escriban datos en la base deben ejecutarse dentro de una transacción y forzar rollback al terminar. Para esos casos se agregó `tests/helpers/rollbackTransaction.js`, que recibe el cliente Prisma y ejecuta el cuerpo de la prueba con el `tx` transaccional, revirtiendo los cambios al finalizar para no persistir datos de prueba.

Flujo recomendado para automatización independiente:

```bash
npm run test:db:migrate
npm run test:db
```

Los scripts de prueba validan primero que exista `DATABASE_TEST_URL` y que no sea la misma URL que `DATABASE_URL`. Para migraciones de prueba, los scripts asignan temporalmente `DATABASE_URL="$DATABASE_TEST_URL"` solo durante el comando de Prisma; fuera de esos comandos, la aplicación sigue usando la URL de producción.
