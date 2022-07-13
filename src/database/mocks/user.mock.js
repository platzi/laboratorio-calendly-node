const { faker } = require('@faker-js/faker/locale/es');

const generateOneUser = () => {
  return {
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    email: faker.internet.email(),
    password: faker.internet.password(),
    avatar: faker.image.avatar(),
  }
}

const generateManyUsers = (size = 5) => {
  const users = [];
  for (let index = 0; index <= size; index++) {
    users.push(generateOneUser());
  }
  return [...users];
}

module.exports = { generateOneUser, generateManyUsers };
