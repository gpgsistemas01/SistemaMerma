import { fileURLToPath } from 'url';
import { basename, dirname, extname, join, normalize, parse, relative, resolve, sep } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const rootDir = join(__dirname, '..');
export const uploadsDir = join(rootDir, 'uploads');
export const avatarsDir = join(uploadsDir, 'avatars');
export const tempDir = join(rootDir, 'temp');
export const coversDir = join(uploadsDir, 'covers');
export const publicDir = join(rootDir, 'public');
export const viewsDir = join(rootDir, 'views');

export const generateFullDir = (filePath, filename) => join(filePath, filename);
export const getNormalizedDir = (path) => normalize(path);
export const generateResolvedPath = (baseDir, filename) => {

    const normalizedBaseDir = getNormalizedDir(baseDir);
    const fullPath = join(normalizedBaseDir, filename);
    const resolvedBase = getNormalizedDir(resolve(normalizedBaseDir));
    const resolvedTarget = getNormalizedDir(resolve(fullPath));

    if (!resolvedTarget.startsWith(resolvedBase + sep)) return null;

    return resolvedTarget;
}
export const getDirname = (fullPath) => dirname(fullPath);
export const getNameFromFile = (path) => {

    const normalizedPath = getNormalizedDir(path);
    
    const { name } = parse(normalizedPath);

    return name;
}
export const getFilename = (fullPath) => {
    
    const normalizedPath = getNormalizedDir(fullPath);
    
    return basename(normalizedPath);
}
export const getBaseDir = (path) => {

    const normalizedPath = getNormalizedDir(path);

    return normalizedPath.split(sep)[0];
}
export const isValidBaseDir = (baseDir, allowedDirs) => allowedDirs.includes(baseDir);
export const sanitizePath = (path) => path.replace(/\\/g, '/').replace(/^\/+/, '');
export const getRelativePath = (basePath, absolutePath) => relative(basePath, absolutePath);
export const getFileExt = (path) => extname(path);