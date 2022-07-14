/* eslint-disable no-console */
const randomSeedDB = require('./../src/database/seeds/random.seed');

(async () => {
  try {
    await randomSeedDB();
  } catch (error) {
    console.error(error);
  }
  process.exit(1);
})();
