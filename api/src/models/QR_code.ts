import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import sequelize from '@self/database';

export default class QR_code extends Model<InferAttributes<QR_code>, InferCreationAttributes<QR_code>> {
    declare id: CreationOptional<number>;
    declare url: string;


    public static initModel(): void {
        console.log("QR_code init model");
        QR_code.init(
            {
                // Model attributes are defined here
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
            }, {
                // Other model options go here
                sequelize, // We need to pass the connection instance
                modelName: 'QR_code', 
                tableName: 'QR_code',
            }
        )
    }
}


