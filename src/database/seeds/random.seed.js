/* eslint-disable no-console */
const getConnection = require('../connection');
const User = require('../entities/user.entity');
const Schedule = require('../entities/schedule.entity');
const { generateManyUsers } = require('../mocks/user.mock');
const { generateOneSchedule } = require('../mocks/schedule.mock');

const randomSeedDB = async () => {
  try {
    const conn = await getConnection();
    await conn.connection.dropDatabase();
    const mockUsers = generateManyUsers();
    const users = await User.insertMany(mockUsers);

    const promises = users.map(async (user) => {
      const userId = user._id;
      const schedule = {
        ...generateOneSchedule,
        user: userId
      };
      const newSchedule = new Schedule(schedule);
      return newSchedule.save(newSchedule);
    });
    Promise.all(promises);
  } catch (error) {
    console.error(error);
  }
};


module.exports = randomSeedDB;
