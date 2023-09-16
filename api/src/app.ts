import express from 'express';

import * as OpenApiValidator from 'express-openapi-validator';

import * as path from "path";

import sequelize from '@self/database';
import config from "@self/environment";

console.log(path.join(__dirname, "services"));
console.log("hello");

const app = express();
app.use(express.json());

app.use(
  OpenApiValidator.middleware({
    apiSpec: './openapi/spec.yml',
    validateRequests: true, 
    validateResponses: true,
    operationHandlers: path.join(__dirname, "services"),
  }),
);


// sync/create db tables if development
if (config.env == "development"){
   sequelize.sync({alter: true, match: /^dev/})
}


export default app;
