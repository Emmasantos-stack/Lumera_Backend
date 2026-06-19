const { Sequelize } = require('sequelize');
const pg = require('pg');
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL;
const databaseName =
  process.env.DB_NAME || process.env.DB_DATABASE || process.env.PGDATABASE;
const databaseHost = process.env.DB_HOST || process.env.PGHOST;
const sslEnabled =
  process.env.DB_SSL === 'true' ||
  process.env.PGSSLMODE === 'require' ||
  Boolean(databaseUrl) ||
  (databaseHost &&
    databaseHost !== 'localhost' &&
    databaseHost !== '127.0.0.1' &&
    !databaseHost.endsWith('.local'));

const baseOptions = {
  dialect: 'postgres',
  dialectModule: pg,
  logging: false,
};

if (sslEnabled) {
  baseOptions.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, baseOptions)
  : new Sequelize(databaseName, process.env.DB_USER, process.env.DB_PASSWORD, {
      ...baseOptions,
      host: databaseHost,
      port: Number(process.env.DB_PORT || 5432),
    });

module.exports = sequelize;
