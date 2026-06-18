const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Log = sequelize.define(
  'LOG',
  {
    id_log: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    origem: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    evento: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    nivel: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Info',
    },
    actor_username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'LOGS',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

module.exports = Log;
