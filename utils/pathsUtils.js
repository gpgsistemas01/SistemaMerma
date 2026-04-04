import { fileURLToPath } from 'url';
import { basename, dirname, extname, join, normalize, parse, relative, resolve, sep } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const rootDir = join(__dirname, '..');
export const publicDir = join(rootDir, 'public');
export const viewsDir = join(rootDir, 'views');