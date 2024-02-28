import * as Sequelize from 'sequelize'

import { DataTypes, Model, Optional, CreationOptional } from 'sequelize'

export type DigitalLink99Attributes = {
    gtin: number
    destinationURL: string
}

export type DigitalLink99CreationAttributes = Optional<
    DigitalLink99Attributes,
    'gtin'
>

export class DigitalLink99 extends Model<
    DigitalLink99Attributes,
    DigitalLink99CreationAttributes
> {
    declare gtin: CreationOptional<number>
    declare destinationURL: string

    static initModel(sequelize: Sequelize.Sequelize): typeof DigitalLink99 {
        return sequelize.define(
            'DigitalLink99',
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
                tableName: 'DigitalLink99',
            }
        ) as typeof DigitalLink99
    }
}
