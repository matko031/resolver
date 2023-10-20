import type { Sequelize } from "sequelize";
import { QR_code as _QR_code } from "./QR_code";
import type { QR_codeAttributes, QR_codeCreationAttributes } from "./QR_code";


export { _QR_code as QR_code }

export type { QR_codeAttributes, QR_codeCreationAttributes }

export function initModels (sequelize: Sequelize) {
    const QR_code  = _QR_code.initModel(sequelize); 

    return { QR_code };
}


