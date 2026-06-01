const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');
const User = require('./User');

const Ticket = sequelize.define(
  'TICKET',
  {
    id_ticket: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    prioridade: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Baixa',
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Aberto',
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'TICKETS',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

Ticket.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Ticket.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });

module.exports = Ticket;
