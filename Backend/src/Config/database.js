const { Sequelize } = require('sequelize');
const pg = require('pg');
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL;

const baseOptions = {
  dialect: 'postgres',
  dialectModule: pg,
  logging: false,
};

if (databaseUrl || process.env.DB_SSL === 'true') {
  baseOptions.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, baseOptions)
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
      ...baseOptions,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 5432),
    });

module.exports = sequelize;
