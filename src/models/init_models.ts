import type { Sequelize } from 'sequelize'
import { DigitalLink as _DigitalLink } from './DigitalLink'
import type {
    DigitalLinkAttributes,
    DigitalLinkCreationAttributes,
} from './DigitalLink'

export { _DigitalLink as DigitalLink }

export type { DigitalLinkAttributes, DigitalLinkCreationAttributes }

export function initModels(sequelize: Sequelize) {
    const DigitalLink: typeof _DigitalLink = _DigitalLink.initModel(sequelize)

    return { DigitalLink }
}
