/* eslint-disable no-console */
const mongoose = require('mongoose');
const config =  require('../config/config');

const URI = `mongodb://${config.dbUser}:${config.dbPassword}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

async function getConnection() {
  try {
    const connection = await mongoose.connect(`${URI}?authSource=admin&readPreference=primary`);
    return connection;
  } catch (error) {
    console.error(URI);
    console.error('Database connection error: ' + error);
    return null;
  }
}

module.exports = getConnection;
