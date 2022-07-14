const supertest = require('supertest');
const { format } = require('date-fns');

const createApp = require('../src/app');
const getConnection = require('../src/database/connection');
const User = require('../src/database/entities/user.entity');
const Schedule = require('../src/database/entities/schedule.entity');
const initSeedDB = require('../src/database/seeds/init.seed');

const formatSlot = (slot) => {
  return `${format(slot.startDate, 'HH:mm')}-${format(slot.endDate, 'HH:mm')}`;
};

// TODO: E2E DTOS 400 bad request

describe('Check slots with the same timezone', () => {
  const app = createApp();
  const server = app.listen(8000);
  const api = supertest(app);
  let conn = null;

  beforeEach(async () => {
    conn = await getConnection();
    await initSeedDB();
  });

  describe('Validate dtos', () => {
    test('should return a 404 with empty body', async () => {
      const { statusCode } = await api.post('/api/v1/availability').send({});
      expect(statusCode).toEqual(404);
    });
    test('should return a 404 with invalid date', async () => {
      const { statusCode } = await api
        .post('/api/v1/availability')
        .send({
          date: 'bla',
          timezone: 'America/Mexico_City',
          scheduleId: '12345',
        });
      expect(statusCode).toEqual(404);
    });
    test('should return a 404 with invalid timezone', async () => {
      const { statusCode } = await api
        .post('/api/v1/availability')
        .send({
          date: '2022-07-18',
          timezone: 'bla',
          scheduleId: '12345',
        });
      expect(statusCode).toEqual(404);
    });
  });

  test('should return right slots', async () => {
    const valeUser = await User.findOne({ email: 'vale@mail.com' });
    const valeSchedule = await Schedule.findOne({ user: valeUser._id });

    const data = {
      date: format(new Date(2022, 6, 11), 'yyyy-MM-dd'),
      scheduleId: valeSchedule._id,
      timezone: valeSchedule.timezone,
    };
    const { body } = await api.post('/api/v1/availability').send(data);
    expect(body.length).toEqual(3);
    expect(formatSlot(body[0])).toEqual('09:00-09:15');
    expect(formatSlot(body[1])).toEqual('09:20-09:35');
    expect(formatSlot(body[2])).toEqual('09:40-09:55');
  });

  afterEach(async () => {
    server.close();
    await conn?.connection?.close();
  });
});
