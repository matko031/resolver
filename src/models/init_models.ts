import type { Sequelize } from 'sequelize'
import { entry as _entry } from './entry'
import type { entryAttributes, entryCreationAttributes } from './entry'

export { _entry as entry }

export type { entryAttributes, entryCreationAttributes }

export function initModels(sequelize: Sequelize) {
    const entry: typeof _entry = _entry.initModel(sequelize)

    return { entry }
}
