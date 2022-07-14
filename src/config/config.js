const env = process.env.NODE_ENV || 'dev';
const envs = {
  'dev': 'dev.env',
  'e2e': 'e2e.env',
  'ci': 'ci.env'
}

require('dotenv').config({
  path: envs[env] ?? 'dev.env'
});

const config = {
  env,
  port: process.env.PORT || 3000,
  dbUser:  process.env.MONGO_USER,
  dbPassword:  process.env.MONGO_PASSWORD,
  dbHost:  process.env.MONGO_HOST,
  dbName:  process.env.MONGO_DB,
  dbPort:  process.env.MONGO_PORT,
}

module.exports = config;
