import { Response } from "express";
import { Request } from "express";
import morgan from "morgan";
import logger from "./logger";
import userAgentParser from "ua-parser-js";

export class HttpLoggerMiddleware {
    /**
     * It takes the data from the morgan middleware and parses it into a JSON object, then it sanitizes
     * the URL and parses the user agent
     *
     * @returns A function that is called by express.
     */
    public morganMiddleware() {
        return morgan(
            (tokens: any, req: Request, res: Response) => {
                return JSON.stringify({
                    method: tokens.method(req, res),
                    url: tokens.url(req, res),
                    http_version: tokens["http-version"](req, res),
                    status: Number.parseFloat(tokens.status(req, res)!),
                    content_length: tokens.res(req, res, "content-length"),
                    response_time: Number.parseFloat(
                        tokens["response-time"](req, res)!,
                    ),
                    user_agent: tokens["user-agent"](req, res),
                });
            },
            {
                stream: {
                    // Configure Morgan to use our custom logger with the http severity
                    write: (message: string) => {
                        const data: Record<string, any> = JSON.parse(message);
                        this.parseUserAgent(data);
                        this.sanitizeUrl(data);
                        return logger.http(data);
                    },
                },
            },
        );
    }

    /**
     * It takes a URL and replaces any IDs in the URL with a colon ID (:id).
     *
     * @param data - Record<string,any>
     * @returns the data object with the url_sanitized property added.
     */
    private sanitizeUrl(data: Record<string, any>) {
        if (!data.url) {
            return;
        }
        const regex = /\/[0-9]+/g;
        const urlWithoutParameter = data.url.replace(regex, "/:id");
        data.url_sanitized = urlWithoutParameter;
    }

    /**
     * It takes a record of data, checks if there's a user_agent property, parses it, and then adds the
     * parsed data to the record.
     *
     * @param data - Record<string,any>
     */
    private parseUserAgent(data: Record<string, any>) {
        if (data.user_agent) {
            const ua = userAgentParser(data.user_agent);
            if (ua.browser) {
                data.user_agent_browser_name = ua.browser.name;
                data.user_agent_browser_version = ua.browser.version;
            }
            if (ua.os) {
                data.user_agent_os_name = ua.os.name;
                data.user_agent_os_version = ua.os.version;
            }
        }
    }
}

const httpLoggerMiddleware = new HttpLoggerMiddleware().morganMiddleware();

export { httpLoggerMiddleware };
