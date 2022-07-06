const mongoose = require('mongoose');
const config =  require('./../config/config');

const URI = `mongodb://${config.dbUser}:${config.dbPassword}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

async function getConnection() {
  try {
    await mongoose.connect(`${URI}?authSource=admin&readPreference=primary`);
    console.log('Database connection successful');
  } catch (error) {
    console.error(URI);
    console.error('Database connection error: ' + error);
  }
}

module.exports = getConnection;
