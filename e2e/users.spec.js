const app = require('../src/index');
const supertest = require('supertest');
const api = supertest(app);

describe('Users endpoints', () => {
  test('get all users', async () => {
    await api.get('/api/v1/users').expect(200);
  });
});
