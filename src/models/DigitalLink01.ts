import * as Sequelize from 'sequelize'

import { DataTypes, Model, Optional, CreationOptional } from 'sequelize'

export type DigitalLink01Attributes = {
    gtin: number
    destinationURL: string
}

export type DigitalLink01CreationAttributes = Optional<
    DigitalLink01Attributes,
    'gtin'
>

export class DigitalLink01 extends Model<
    DigitalLink01Attributes,
    DigitalLink01CreationAttributes
> {
    declare gtin: CreationOptional<number>
    declare destinationURL: string

    static initModel(sequelize: Sequelize.Sequelize): typeof DigitalLink01 {
        return sequelize.define(
            'DigitalLink01',
            {
                gtin: {
                    type: DataTypes.BIGINT.UNSIGNED.ZEROFILL,
                    allowNull: false,
                    primaryKey: true,
                },
                destinationURL: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
            },
            {
                tableName: 'DigitalLink01',
            }
        ) as typeof DigitalLink01
    }
}
