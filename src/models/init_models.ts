import type { Sequelize } from 'sequelize'
import { DigitalLink01 as _DigitalLink01 } from './DigitalLink01'
import { DigitalLink99 as _DigitalLink99 } from './DigitalLink99'
import type {
    DigitalLink01Attributes,
    DigitalLink01CreationAttributes,
} from './DigitalLink01'

import type {
    DigitalLink99Attributes,
    DigitalLink99CreationAttributes,
} from './DigitalLink99'

export { _DigitalLink01 as DigitalLink01, _DigitalLink99 as DigitalLink99 }

export type {
    DigitalLink01Attributes,
    DigitalLink01CreationAttributes,
    DigitalLink99Attributes,
    DigitalLink99CreationAttributes,
}

export function initModels(sequelize: Sequelize) {
    const DigitalLink01: typeof _DigitalLink01 =
        _DigitalLink01.initModel(sequelize)
    const DigitalLink99: typeof _DigitalLink99 =
        _DigitalLink99.initModel(sequelize)

    return { DigitalLink01, DigitalLink99 }
}
