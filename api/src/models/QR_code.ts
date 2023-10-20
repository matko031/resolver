import * as Sequelize from "sequelize";

import { DataTypes, Model, Optional, CreationOptional } from 'sequelize';

export type QR_codeAttributes = {
    id: number,
    url: string
}

export type QR_codeCreationAttributes = Optional<QR_codeAttributes, "id">

export class QR_code extends Model<QR_codeAttributes, QR_codeCreationAttributes> {
    declare id: CreationOptional<number>;
    declare url: string;


    static initModel(sequelize: Sequelize.Sequelize): typeof QR_code {
        console.log("QR_code init model");
        return sequelize.define(
            "QR_code",
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
                tableName: 'QR_code',
            }
        ) as typeof QR_code;
    }
}


