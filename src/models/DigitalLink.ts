import * as Sequelize from 'sequelize'

import { DataTypes, Model, Optional, CreationOptional } from 'sequelize'

export type DigitalLinkAttributes = {
    gtin: number
    destinationURL: string
}

export type DigitalLinkCreationAttributes = Optional<
    DigitalLinkAttributes,
    'gtin'
>

export class DigitalLink extends Model<
    DigitalLinkAttributes,
    DigitalLinkCreationAttributes
> {
    declare gtin: CreationOptional<number>
    declare destinationURL: string

    static initModel(sequelize: Sequelize.Sequelize): typeof DigitalLink {
        return sequelize.define(
            'DigitalLink',
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
                tableName: 'DigitalLink',
            }
        ) as typeof DigitalLink
    }
}
