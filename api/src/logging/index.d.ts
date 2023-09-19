export default class WinstonLogger {
    /**
     * It logs a debug message.
     * @param {any} message - The message to log.
     */
    public debug(message: any): void;

    /**
     * It logs a info message.
     * @param {any} message - The message to be logged.
     */
    public info(message: any): void;

    /**
     * It logs an http request.
     * @param {any} message - The message to be logged.
     */
    public http(message: any): void;

    /**
     * It logs a warning message.
     * @param {any} message - The message to be logged.
     */
    public warn(message: any): void;

    /**
     * It logs an error message.
     * @param {any} message - The message to be logged.
     */
    public error(message: any): void;
}

export class LoggerFactory {
    public static createLogger: WinstonLogger;
}

export function getLogLevel(): string;

export function timezoneCorrection(): string;

export function isDevEnvironment(): boolean;

export class HttpLoggerMiddleware {
    public morganMiddleware();

    private sanitizeUrl(data: Record<string, any>): void;
    private parseUserAgent(data: Record<string, any>): void;
}
