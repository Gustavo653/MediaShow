const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DATABASE_SCHEMA,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_IP,
    dialect: process.env.DATABASE_TYPE,
    logging: true,
  }
);

module.exports = sequelize;
