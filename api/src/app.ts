import express, {Request, Response, NextFunction} from 'express';
import { omitBy } from "lodash";
import * as OpenApiValidator from 'express-openapi-validator';

import * as path from "path";
import { httpLoggerMiddleware } from "@self/logging";

import db from '@self/database';
import config from "@self/environment";

import {
    notFoundHandler,
    trustedError,
    uncaughtException,
    unhandledRejection,
    allowedHttpMethods,
    DatabaseErrorHandler,
} from "@self/error-handling/index";


const app = express();
app.use(express.json());


// Filters http methods before routing
app.use(allowedHttpMethods(["GET", "POST", "DELETE"]));

// API key authentication
const auth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get("Authorization");
    let authOK = false;
    if (authHeader){
        const authHeaderList = authHeader.split(" ");
        if ( authHeaderList.length == 2 && authHeaderList[0] === "Bearer" ) 
        {
            const token = authHeaderList[1];
            if ( token && token === config.auth_token ) { authOK = true; } 
            else { console.log(`Wrong token: '${token}'`); }
        } 
        else { console.log(`Not a bearer token: '${authHeaderList}'`); }
    } else { console.log("No Authorization header"); }

    if (authOK)
    {
        console.log("authOK");
        return next();
    } 
    else 
    {
        console.log("authNOK");
        res.status(401).json({message: "", errors: "Wrong authentication token"})
    }
}
app.use(auth);



// -------- Error Handling --------
// Checks for undefined route errors and throws an 404
//app.use(notFoundHandler);

// Log all requests before further processing them
app.use(httpLoggerMiddleware);


// Handles database related errors
app.use(DatabaseErrorHandler);

// Checks if the error is operational or not
// Also logs the errors
app.use(trustedError);


interface ValidationError {
    status?: number;
    message?: string;
    errors?: ValidationError[];
}
app.use(
    (err: ValidationError, _req: Request, res: Response, next: NextFunction) => {
        res.status(err.status || 500).json(
            omitBy(
                {
                    message: err.message,
                    errors: err.errors ? err.errors : [],
                },
                (v) => !v,
            ),
        );
        next();
    },
);


app.use(
  OpenApiValidator.middleware({
    apiSpec: path.join(__dirname, "..", "specs", "spec.yml"),
    validateRequests: true, 
    validateResponses: false,
    operationHandlers: path.join(__dirname, "services"),
  }),
);


// Handles unhandled promises
process.on("unhandledRejection", unhandledRejection);

// Handles non operational errors
process.on("uncaughtException", uncaughtException);



// sync/create db tables if development
if (config.env == "development"){
   db.sequelize.sync({alter: true, match: /^dev/})
}


export default app;
