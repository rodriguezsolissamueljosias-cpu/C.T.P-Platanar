const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'ctp_platanar',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'sam2904',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      underscored: false, // Mantener camelCase
      timestamps: true,
    },
  }
);

module.exports = sequelize;
