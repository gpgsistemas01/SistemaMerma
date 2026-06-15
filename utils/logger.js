import pino from 'pino';
import pinoHttp from 'pino-http';
import { AppError } from '../errors/AppError.js';

const DEFAULT_LOG_LEVEL = 'info';
const LOG_LEVELS = new Set(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']);

const normalizeLogLevel = (level, fallback = DEFAULT_LOG_LEVEL) => {
    if (typeof level !== 'string') return fallback;

    const normalizedLevel = level.toLowerCase();

    return LOG_LEVELS.has(normalizedLevel) ? normalizedLevel : fallback;
};

const configuredLogLevel = normalizeLogLevel(process.env.LOG_LEVEL);

export const logger = pino({
    level: configuredLogLevel,
    serializers: {
        err: pino.stdSerializers.err,
        error: pino.stdSerializers.err,
        req: pino.stdSerializers.req,
        res: pino.stdSerializers.res
    },
    timestamp: pino.stdTimeFunctions.isoTime
});

if (process.env.LOG_LEVEL && configuredLogLevel !== process.env.LOG_LEVEL.toLowerCase()) {
    logger.warn(
        {
            configuredLevel: process.env.LOG_LEVEL,
            fallbackLevel: DEFAULT_LOG_LEVEL,
            supportedLevels: [...LOG_LEVELS]
        },
        'Nivel de log no soportado; se usará el nivel por defecto'
    );
}

export const createServiceLogger = (service) => logger.child({ layer: 'service', service });

const getDefaultErrorLogLevel = (err) => err instanceof AppError ? 'warn' : 'error';

export const logServiceError = (
    serviceLogger,
    err,
    { level, ...context } = {},
    message = 'Error en servicio'
) => {
    serviceLogger[normalizeLogLevel(level, getDefaultErrorLogLevel(err))]({ err, ...context }, message);
};

export const pinoLogger = pinoHttp({
    logger,
    customLogLevel: (_req, res, err) => {
        if (err || res.statusCode >= 500) return 'error';
        if (res.statusCode >= 400) return 'warn';
        if (res.statusCode >= 300) return 'silent';

        return 'info';
    },
    customSuccessMessage: (req, res) => `${req.method} ${req.url} completado`,
    customErrorMessage: (req, res) => `${req.method} ${req.url} falló`,
    redact: [
        'req.headers.cookie',
        'req.headers.authorization'
    ]
});
