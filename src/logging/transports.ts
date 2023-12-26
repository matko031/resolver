import Transport from "winston-transport";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import logger from "./logger";

/* A default configuration for the winston-daily-rotate-file transport. */
const defaultConfig: DailyRotateFile.DailyRotateFileTransportOptions = {
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
};

const combinedFileTransport: Transport = new DailyRotateFile({
    filename: "api-resolver-combined-%DATE%.log",
    dirname: "./logs",
    options: defaultConfig,
});

const errorFileTransport: Transport = new DailyRotateFile({
    filename: "api-resolver-errors-%DATE%.log",
    dirname: "./logs",
    options: {
        ...defaultConfig,
        level: "error",
    },
});

const exceptionFileTransport: Transport = new DailyRotateFile({
    filename: "api-resolver-exception-%DATE%.log",
    dirname: "./logs",
    options: { ...defaultConfig, handleExceptions: true },
});

const rejectionFileTransport: Transport = new DailyRotateFile({
    filename: "api-resolver-rejection-%DATE%.log",
    dirname: "./logs",
    options: {
        ...defaultConfig,
        handleRejections: true,
    },
});

const consoleTransport: Transport = new winston.transports.Console();

const transports: Transport[] = [
    combinedFileTransport,
    errorFileTransport,
    exceptionFileTransport,
    rejectionFileTransport,
];

// Register File Transport Events

// fired when a log file is created
transports.forEach((transport) => {
    transport.on("new", (filename) => {
        logger.info(`A new log file has been created (${filename})`);
    });
});
// fired when a log file is rotated
transports.forEach((transport) => {
    transport.on("rotate", (oldFilename, newFilename) => {
        logger.warn(
            `A log rotation took place: ${oldFilename} --> ${newFilename}`,
        );
    });
});

// fired when a log file is archived
transports.forEach((transport) => {
    transport.on("archive", (zipFilename) => {
        logger.warn(`${zipFilename} has been archived`);
    });
});

// fired when a log file is deleted
transports.forEach((transport) => {
    transport.on("logRemoved", (removedFilename) => {
        logger.warn(`A log file has been removed: ${removedFilename}`);
    });
});

export const isDevEnvironment = () => process.env.NODE_ENV === "development";

if (isDevEnvironment()) transports.push(consoleTransport);

export default transports;
