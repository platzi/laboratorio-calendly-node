require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 3000,
  dbUser:  process.env.MONGO_USER,
  dbPassword:  process.env.MONGO_PASSWORD,
  dbHost:  process.env.MONGO_HOST,
  dbName:  process.env.MONGO_DB,
  dbPort:  process.env.MONGO_PORT,
}

module.exports = config;
