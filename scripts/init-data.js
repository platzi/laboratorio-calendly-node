/* eslint-disable no-console */
const initSeedDB = require('./../src/database/seeds/init.seed');

(async () => {
  try {
    await initSeedDB();
    console.log('initSeedDB run successfully!');
  } catch (error) {
    console.error(error);
  }
  process.exit(1);
})();
