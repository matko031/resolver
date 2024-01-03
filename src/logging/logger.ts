import winston, { Logger } from 'winston'
import transports from './transports'
import util from 'util'

type LogLevels = 'error' | 'warn' | 'info' | 'http' | 'debug'

// I checked it on the GitHub repo that these are the available colors
// The typescript types don't verify yet that the the specified color exists so I add this
// to save us from possible runtime errors
type WinstonColors =
    | 'black'
    | 'red'
    | 'green'
    | 'yellow'
    | 'blue'
    | 'magenta'
    | 'cyan'
    | 'white'
    | 'gray'
    | 'grey'

type ColorObject = {
    [key in LogLevels]: WinstonColors
}

const defaultColors: ColorObject = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

export class LoggerFactory {
    /**
     * This function creates a logger that logs to the console and files, and it formats the log
     * messages with a timestamp, a level, and a message.
     *
     * @returns A WinstonLogger object.
     */
    public static createLogger(
        colors: ColorObject = defaultColors
    ): WinstonLogger {
        const { combine, timestamp, printf, colorize, align, errors } =
            winston.format
        const logger = winston.createLogger({
            level: getLogLevel(),
            format: combine(
                errors({ stack: true }),
                //colorize({ all: true }),
                timestamp({
                    format: timezoneCorrection,
                }),
                align(),
                printf(
                    (info) =>
                        `[${info.timestamp}] - @Resolver - ${info.level}: ${info.message}`
                )
            ),
            transports,
        })

        winston.addColors(colors)

        return new WinstonLogger(logger)
    }
}

export class WinstonLogger {
    public logger: Logger

    constructor(logger: Logger) {
        this.logger = logger
    }

    /**
     * It logs a debug message.
     *
     * @param {any} message - any - The message to log.
     */
    public debug(message: any) {
        this.logger.debug(message)
    }

    /**
     * It logs a info message.
     *
     * @param {any} message - The message to be logged.
     */
    public info(message: any) {
        this.logger.info(message)
    }

    /**
     * It logs an http request.
     *
     * @param {any} message - any - The message to be logged.
     */
    public http(message: any) {
        this.logger.http(message)
    }

    /**
     * It logs a warning message.
     *
     * @param {any} message - The message to be logged.
     */
    public warn(message: any) {
        this.logger.warn(message)
    }

    /**
     * It logs an error message.
     *
     * @param {any} message - The message to be logged.
     */
    public error(message: any) {
        this.logger.error(message)
    }
}

/**
 * It returns the current date and time in the Brussels timezone.
 *
 * @returns A string.
 */
export const timezoneCorrection = () => {
    return new Date().toLocaleString('en-GB', {
        timeZone: 'Europe/Brussels',
    })
}

/**
 * It returns the log level based on the environment.
 *
 * @returns {string} If development then `debug`, else `warn`.
 */
export const getLogLevel = (): string => {
    return process.env.NODE_ENV === 'development' ? 'debug' : 'info'
}

const logger = LoggerFactory.createLogger()

export default logger
