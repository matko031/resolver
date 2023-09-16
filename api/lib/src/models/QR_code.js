"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../database"));
class QR_code extends sequelize_1.Model {
}
QR_code.init({
    // Model attributes are defined here
    ID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    link: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
}, {
    // Other model options go here
    sequelize: database_1.default,
    modelName: 'QR_code',
    tableName: 'QR_code'
});
//# sourceMappingURL=QR_code.js.map