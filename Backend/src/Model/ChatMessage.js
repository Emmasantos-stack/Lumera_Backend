const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const ChatMessage = sequelize.define(
  'CHAT_MESSAGE',
  {
    id_message: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sender_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sender_role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    room: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'global',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'CHAT_MESSAGES',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

module.exports = ChatMessage;
