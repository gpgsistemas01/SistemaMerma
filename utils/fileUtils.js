import { extname } from 'path';
import { fileTypeFromBuffer } from "file-type";

export const getFileExtension = (filename) => extname(filename).toLowerCase();

export const validateBuffer = async (mimes, exts, file) => {

    const type = await fileTypeFromBuffer(file);

    if (!type || !mimes.includes(type.mime) || !exts.includes(type.ext)) return false;

    return true;
}