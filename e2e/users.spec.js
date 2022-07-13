const createApp = require('../src/app');
const getConnection = require('../src/database/connection');
const supertest = require('supertest');
const User = require('./../src/database/entities/user.entity');
const initSeedDB = require('./../src/database/seeds/init.seed');


describe('Users endpoints', () => {

  const app = createApp();
  const server = app.listen(8000);
  const api = supertest(app);
  let conn = null;

  beforeEach(async () => {
    conn = await getConnection();
    await initSeedDB();
  });

  test('get all users', async () => {
    const users = await User.find();
    const { status, body } = await api.get('/api/v1/users');
    expect(status).toEqual(200);
    expect(body.length).toEqual(users.length);
  });

  afterEach(async () => {
    server.close();
    await conn?.connection?.close();
  });
});
