const { faker } = require('@faker-js/faker/locale/es');

const generateOneSchedule = () => {
  return {
    title: faker.name.jobArea(),
    description: faker.lorem.sentences(),
    password: faker.internet.password(),
    duration: faker.datatype.number({min: 10, max: 60}),
    margin: faker.datatype.number({min: 0, max: 20}),
    timezone: faker.address.timeZone(),
    availability: [],
  }
}

const generateManySchedule = (size = 5) => {
  const users = [];
  for (let index = 0; index <= size; index++) {
    users.push(generateOneSchedule());
  }
  return [...users];
}

module.exports = { generateOneSchedule, generateManySchedule };
