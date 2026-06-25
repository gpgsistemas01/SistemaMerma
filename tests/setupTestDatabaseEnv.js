import { validateTestDatabaseEnv } from '../scripts/verifyTestDatabaseEnv.js';

const shouldValidateDatabaseEnv = Boolean(process.env.DATABASE_URL || process.env.DATABASE_TEST_URL);

if (shouldValidateDatabaseEnv) {
  validateTestDatabaseEnv();
}

if (process.env.DATABASE_TEST_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_TEST_URL;
}
