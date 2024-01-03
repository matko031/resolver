/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-classes-per-file */
/**
 * @exports
 * @class httpError
 * @extends {Error}
 */
export class HttpError extends Error {
    public readonly name: string
    public readonly httpCode: HttpStatusCode
    public readonly error: any
    public readonly isOperational: boolean

    constructor(httpCode: HttpStatusCode, error: any, isOperational: boolean) {
        super(HttpStatusPhrase.get(httpCode))
        Object.setPrototypeOf(this, new.target.prototype)

        // Object to be returned
        this.name = HttpStatusPhrase.get(httpCode) || 'undefined'
        this.httpCode = httpCode
        this.error = error
        this.isOperational = isOperational

        // Logs the stack
        // This only applies when running in dev
        if (process.env.NODE_ENV === 'development')
            Error.captureStackTrace(this)
    }
}

/**
 * @exports
 * @class BadRequest
 * @extends {HttpError}
 */
export class BadRequest extends HttpError {
    constructor(error: any, isOperational: boolean) {
        super(HttpStatusCode.BAD_REQUEST, error, isOperational)
    }
}

/**
 * @exports
 * @class Unauthorized
 * @extends {HttpError}
 */
export class Unauthorized extends HttpError {
    constructor(error: any, isOperational: boolean) {
        super(HttpStatusCode.UNAUTHORIZED, error, isOperational)
    }
}

/**
 * @exports
 * @class Forbidden
 * @extends {HttpError}
 */
export class Forbidden extends HttpError {
    constructor(error: any, isOperational: boolean) {
        super(HttpStatusCode.FORBIDDEN, error, isOperational)
    }
}

/**
 * @exports
 * @class NotFound
 * @extends {HttpError}
 */
export class NotFound extends HttpError {
    constructor(error: any, isOperational: boolean) {
        super(HttpStatusCode.NOT_FOUND, error, isOperational)
    }
}

/**
 * @exports
 * @class MethodNotAllowed
 * @extends {HttpError}
 */
export class MethodNotAllowed extends HttpError {
    constructor(error: any, isOperational: boolean) {
        super(HttpStatusCode.METHOD_NOT_ALLOWED, error, isOperational)
    }
}

/**
 * @exports
 * @class Conflict
 * @extends {HttpError}
 */
export class Conflict extends HttpError {
    constructor(error: any, isOperational: boolean) {
        super(HttpStatusCode.CONFLICT, error, isOperational)
    }
}

/**
 * @exports
 * @class InternalServerError
 * @extends {HttpError}
 */
export class InternalServerError extends HttpError {
    constructor(error: any, isOperational: boolean) {
        super(HttpStatusCode.INTERNAL_SERVER, error, isOperational)
    }
}

/**
 * @exports
 * @class NotImplemented
 * @extends {HttpError}
 */
export class NotImplemented extends HttpError {
    constructor(error: any, isOperational: boolean) {
        super(HttpStatusCode.NOT_IMPLEMENTED, error, isOperational)
    }
}

/**
 * @exports
 * @class BadGateway
 * @extends {HttpError}
 */
export class BadGateway extends HttpError {
    constructor(error: any, isOperational: boolean) {
        super(HttpStatusCode.BAD_GATEWAY, error, isOperational)
    }
}

/**
 * @exports
 * @class ServiceUnavailable
 * @extends {HttpError}
 */
export class ServiceUnavailable extends HttpError {
    constructor(error: any, isOperational: boolean) {
        super(HttpStatusCode.SERVICE_UNAVAILABLE, error, isOperational)
    }
}

/**
 * @exports
 * @class GatewayTimeout
 * @extends {HttpError}
 */
export class GatewayTimeout extends HttpError {
    constructor(error: any, isOperational: boolean) {
        super(HttpStatusCode.GATEWAY_TIMEOUT, error, isOperational)
    }
}

/**
 * @exports
 * @class dbError
 * @extends {HttpError}
 */
export class dbError extends HttpError {}

/**
 * @exports
 * @enum {number}
 */
export enum HttpStatusCode {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    CONFLICT = 409,
    INTERNAL_SERVER = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
}

// Map HttpStatusCode to status phrase
const HttpStatusPhrase: Map<HttpStatusCode, string> = new Map([
    [HttpStatusCode.BAD_REQUEST, 'Bad Request'],
    [HttpStatusCode.UNAUTHORIZED, 'Unauthorized'],
    [HttpStatusCode.FORBIDDEN, 'Forbidden'],
    [HttpStatusCode.NOT_FOUND, 'Not Found'],
    [HttpStatusCode.METHOD_NOT_ALLOWED, 'Method Not Allowed'],
    [HttpStatusCode.CONFLICT, 'Conflict'],
    [HttpStatusCode.INTERNAL_SERVER, 'Internal Server Error'],
    [HttpStatusCode.NOT_IMPLEMENTED, 'Not Implemented'],
    [HttpStatusCode.BAD_GATEWAY, 'Bad Gateway'],
    [HttpStatusCode.SERVICE_UNAVAILABLE, 'Service Unavailable'],
    [HttpStatusCode.GATEWAY_TIMEOUT, 'Gateway Timeout'],
])
