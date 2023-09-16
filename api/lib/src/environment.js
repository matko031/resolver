"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertNonNullable = exports.getConfig = exports.getEnv = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const getEnv = () => process.env.NODE_ENV || "development";
exports.getEnv = getEnv;
// Loading process.env as ENV interface
const getConfig = (node_env) => {
    const environments = {
        development: {
            env: "development",
            port: process.env.PORT ? Number(process.env.PORT) : 3000,
            database_name: process.env.DATABASE_NAME,
            database_username: process.env.DATABASE_USERNAME,
            database_password: process.env.DATABASE_PASSWORD,
            database_host: process.env.DATABASE_HOST,
            database_dialect: process.env.DATABASE_DIALECT,
        },
        production: {
            env: "production",
            port: Number(process.env.PORT),
            database_name: process.env.DATABASE_NAME,
            database_username: process.env.DATABASE_USERNAME,
            database_password: process.env.DATABASE_PASSWORD,
            database_host: process.env.DATABASE_HOST,
            database_dialect: process.env.DATABASE_DIALECT,
        },
        test: {
            env: "test",
            port: process.env.PORT ? Number(process.env.PORT) : 3000,
            database_name: process.env.DATABASE_NAME,
            database_username: process.env.DATABASE_USERNAME,
            database_password: process.env.DATABASE_PASSWORD,
            database_host: process.env.DATABASE_HOST,
            database_dialect: process.env.DATABASE_DIALECT,
        },
    };
    return environments[node_env];
};
exports.getConfig = getConfig;
// Throwing an Error if any field was undefined we don't want our app to
// run if it can't connect to DB and ensure that these fields are accessible.
// If all is good return it as Config which just removes the undefined from our
// type definition.
const assertNonNullable = (variables) => {
    Object.keys(variables).forEach((key) => {
        if (!variables[key]) {
            throw new Error(`Missing key ${key} in config`);
        }
    });
};
exports.assertNonNullable = assertNonNullable;
const config = (0, exports.getConfig)((0, exports.getEnv)());
(0, exports.assertNonNullable)(config);
exports.default = config;
//# sourceMappingURL=environment.js.map