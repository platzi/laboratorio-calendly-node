const supertest = require('supertest');
const { format } = require('date-fns');

const createApp = require('../src/app');
const getConnection = require('../src/database/connection');
const User = require('../src/database/entities/user.entity');
const Schedule = require('../src/database/entities/schedule.entity');
const initSeedDB = require('../src/database/seeds/init.seed');

const formatSlot = (slot) => {
  const startTime = format(new Date(slot.start), 'HH:mm');
  const endTime = format(new Date(slot.end), 'HH:mm');
  return `${startTime}-${endTime}`;
};

// TODO: schedule not found
// TODO: return [] when date is not in availi..

describe('Tests for availability', () => {
  const app = createApp();
  const server = app.listen(8000);
  const api = supertest(app);
  let conn = null;

  beforeEach(async () => {
    conn = await getConnection();
    await initSeedDB();
  });

  describe('Errors with wrong data', () => {
    test('should return a 400 (Bad Request) with empty body', async () => {
      const { statusCode } = await api.post('/api/v1/availability').send({});
      expect(statusCode).toEqual(400);
    });
    test('should return a 400 (Bad Request) with invalid date', async () => {
      const { statusCode } = await api.post('/api/v1/availability').send({
        date: 'bla',
        timezone: 'America/Mexico_City',
        scheduleId: '12345',
      });
      expect(statusCode).toEqual(400);
    });
    test('should return a 400 (Bad Request) with invalid timezone', async () => {
      const { statusCode } = await api.post('/api/v1/availability').send({
        date: '2022-07-18',
        timezone: 'bla',
        scheduleId: '12345',
      });
      expect(statusCode).toEqual(400);
    });
    test('should return a 400 (Bad Request) with invalid scheduleId', async () => {
      const { statusCode } = await api.post('/api/v1/availability').send({
        date: '2022-07-18',
        timezone: 'America/Mexico_City',
        scheduleId: '1',
      });
      expect(statusCode).toEqual(400);
    });
    test('should return a 404 (Not Found) with scheduleId', async () => {
      const { statusCode } = await api.post('/api/v1/availability').send({
        date: '2022-07-18',
        timezone: 'America/Mexico_City',
        scheduleId: '62cf9d5f4f3743814e3d1a2e',
      });
      expect(statusCode).toEqual(404);
    });
  });

  describe('Generating slots', () => {
    test('should return right slots', async () => {
      const valeUser = await User.findOne({ email: 'vale@mail.com' });
      const valeSchedule = await Schedule.findOne({ user: valeUser._id });

      const data = {
        date: '2022-07-18',
        scheduleId: valeSchedule._id,
        timezone: valeSchedule.timezone,
      };
      const { body } = await api.post('/api/v1/availability').send(data);
      expect(body.length).toEqual(3);
      expect(formatSlot(body[0])).toEqual('09:00-09:15');
      expect(formatSlot(body[1])).toEqual('09:20-09:35');
      expect(formatSlot(body[2])).toEqual('09:40-09:55');
    });
  });

  afterEach(async () => {
    server.close();
    await conn?.connection?.close();
  });
});
