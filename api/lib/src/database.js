"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const environment_1 = __importDefault(require("./environment"));
const sequelize = new sequelize_1.Sequelize({
    database: environment_1.default.database_name,
    username: environment_1.default.database_username,
    password: environment_1.default.database_password,
    host: environment_1.default.database_host,
    dialect: environment_1.default.database_dialect,
    isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
});
exports.default = sequelize;
//# sourceMappingURL=database.js.map