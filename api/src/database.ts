import { Sequelize, Options, Transaction } from "sequelize";
import config from "@self/environment";
import * as models from "@models/init_models";

const sequelize: Sequelize = new Sequelize({
    database: config.database_name,
    username: config.database_username,
    password: config.database_password,
    host: config.database_host,
    dialect: config.database_dialect,
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
} as Options);

const db = {
    Sequelize,
    sequelize,
    ...models.initModels(sequelize),
};


export default db;

