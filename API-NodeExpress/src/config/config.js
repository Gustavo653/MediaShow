const fs = require('fs');

module.exports = {
  development: {
    username: 'root',
    password: 'SenhaBraba123',
    database: 'MediaShowAPI',
    host: 'localhost',
    dialect: 'mysql', 
    logging: console.log
  },
  test: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_SCHEMA,
    host: process.env.DATABASE_IP,
    dialect: process.env.DATABASE_TYPE
  },
  production: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_SCHEMA,
    host: process.env.DATABASE_IP,
    dialect: process.env.DATABASE_TYPE
  },
};