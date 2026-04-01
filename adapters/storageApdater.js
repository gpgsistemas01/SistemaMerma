import { existsSync, mkdirSync, renameSync, statSync, unlinkSync } from 'fs';
import { writeFile } from 'fs/promises';
import { avatarsDir, coversDir, generateResolvedPath, getBaseDir, getDirname, getFilename, isValidBaseDir, sanitizePath, tempDir } from "../utils/pathsUtils.js";
import { fileTypeFromBuffer } from 'file-type';

const processLocal = async (filepath, targetDir, userId, mode) => {

    if (
        mode === 'update' && 
        (!existsSync(avatarsDir) || !existsSync(coversDir))
    ) return -3;

    if (mode === 'create') {

        if (!existsSync(tempDir)) return -3;

        const fullDir = generateResolvedPath(targetDir, userId);
        const dirname = getDirname(fullDir);
    
        if (!existsSync(dirname)) mkdirSync(dirname, { recursive: true });

        const stats = statSync(filepath);

        if (!stats.isFile()) return -4;

        try {
            
            renameSync(filepath, fullDir);

        } catch (err) {

            console.log(err);
            return -5;
        }
    }
}

const processCloud = async (filepath, targetDir) => {

    return;
}

const uploadLocal = async (buffer, targetDir, userId, mode) => {

    const id = mode === 'download' ? userId : crypto.randomUUID();
    const type = await fileTypeFromBuffer(buffer);
    const filename = `${ id }.${ type.ext }`;
    const fullDir = generateResolvedPath(targetDir, filename);
    const dirname = getDirname(fullDir);

    if (!existsSync(dirname)) mkdirSync(dirname, { recursive: true });

    try {

        await writeFile(fullDir, buffer);

    } catch (err) {

        console.log(err);
        return { filename: null };
    }

    return { filename };
}

const uploadCloud = async (file) => {

    return { url: null, id: null };
}

const revertLocal = (filepath, targetDir) => {

    if (!existsSync(targetDir)) return -3;

    const sanitizedPath = sanitizePath(filepath);
    const baseDir = getBaseDir(sanitizedPath);

    if (!isValidBaseDir(baseDir, ['temp'])) return -2;

    const filename = getFilename(sanitizedPath);
    const fullDir = generateResolvedPath(targetDir, filename);

    if (!existsSync(fullDir)) return -4;

    const stats = statSync(fullDir);

    if (!stats.isFile()) return -5;

    // validate user -6

    try {

        unlinkSync(fullDir);

        return 1;

    } catch (err) {

        console.log(err);
        return -7;
    }
} 

const revertCloud = async (filepath) => {

    return;
}

export const storage = {

    async process(filepath, targetDir, userId, mode) {

        if (process.env.STORAGE === 'local') return processLocal(filepath, targetDir, userId, mode);
        else return processCloud(filepath, targetDir, userId, mode);
    },
    async upload({ buffer, targetDir, userId = null, mode }) {

        if (process.env.STORAGE === 'local') return uploadLocal(buffer, targetDir, userId, mode);
        else return uploadCloud(buffer);
    },
    async revert(filepath, targetDir) {

        if (process.env.STORAGE === 'local') return revertLocal(filepath, targetDir);
        else return revertCloud(filepath);
    }
}