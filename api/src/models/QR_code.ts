import {DataTypes, Model } from 'sequelize';
import sequelize from '@self/database';

class QR_code extends Model {}

QR_code.init({
  // Model attributes are defined here
  ID: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true, 
  },
  link: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'QR_code', 
  tableName: 'QR_code'
});

