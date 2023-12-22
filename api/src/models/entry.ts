import * as Sequelize from "sequelize";

import { DataTypes, Model, Optional, CreationOptional } from 'sequelize';

export type entryAttributes = {
    id: number,
    url: string
}

export type entryCreationAttributes = Optional<entryAttributes, "id">

export class entry extends Model<entryAttributes, entryCreationAttributes> {
    declare id: CreationOptional<number>;
    declare url: string;


    static initModel(sequelize: Sequelize.Sequelize): typeof entry {
        console.log("entry init model");
        return sequelize.define(
            "entry",
            {
                id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true, 
                },
                url: {
                    type: DataTypes.STRING,
                    allowNull: true
                }
            },
            {
                tableName: 'entry',
            }
        ) as typeof entry;
    }
}


