import multer from "multer";
import { errorCodeMessages } from "../messages/codeMessages.js";
import { getFileExtension, validateBuffer } from "../utils/fileUtils.js";

export const createUpload = ({ field, maxSize, mimes, exts }) => {

    const upload = multer({

        limits: { fileSize: maxSize },
        fileFilter: (req, file, cb) => {

            if (file.fieldname !== field) return cb(new multer.MulterError(
                errorCodeMessages.LIMIT_UNEXPECTED_FILE, 
                file.fieldname
            ));

            if (!mimes.includes(file.mimetype)) return cb(
                new Error(errorCodeMessages.INVALID_FILE_TYPE)
            );

            const ext = getFileExtension(file.originalname);

            if (!exts.includes(ext)) return cb(new Error(errorCodeMessages.INVALID_FILE_EXTENSION));

            cb(null, true);
        }
    });

    return (req, res, next) => {

        upload.single(field)(req, res, (err) => {

            if (!err) return next();

            if (err instanceof multer.MulterError) return res.status(400).json({ code: err.code, field });

            return res.status(400).json({ code: err.message || errorCodeMessages.INVALID_FILE, field });
        });
    }
}

export const validateFile = (uploadType) => (req, res, next) => {

    const { file } = req;

    if (!file || file.buffer.length === 0) return res.status(400).json({ 
        code: errorCodeMessages.EMPTY_FILE 
    });
    
    const isValid = validateBuffer(uploadType.mimes, uploadType.exts, file.buffer);
    
    if (!isValid) return res.status(400).json({ code: errorCodeMessages.INVALID_FILE_CONTENT });

    next();
}