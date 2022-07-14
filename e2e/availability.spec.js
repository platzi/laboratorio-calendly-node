const supertest = require('supertest');
const { utcToZonedTime, format: formatTz  } = require("date-fns-tz");

const createApp = require('../src/app');
const getConnection = require('../src/database/connection');
const User = require('../src/database/entities/user.entity');
const Schedule = require('../src/database/entities/schedule.entity');
const initSeedDB = require('../src/database/seeds/init.seed');

const formatSlot = (slot, userTZ) => {
  const startDate = new Date(slot.start);
  const zonedStartTime = utcToZonedTime(startDate, userTZ);
  const hourStartTime = formatTz(zonedStartTime, 'HH:mm', {timeZone: userTZ});

  const endDate = new Date(slot.end);
  const zonedEndTime = utcToZonedTime(endDate, userTZ);
  const hourEndTime = formatTz(zonedEndTime, 'HH:mm', {timeZone: userTZ});
  return `${hourStartTime}-${hourEndTime}`;
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
    test('should return slots with the same timezone', async () => {
      const valeUser = await User.findOne({ email: 'vale@mail.com' });
      const valeSchedule = await Schedule.findOne({ user: valeUser._id });

      const userTZ = valeSchedule.timezone;

      const data = {
        date: '2022-07-18',
        scheduleId: valeSchedule._id,
        timezone: userTZ,
      };
      const { body } = await api.post('/api/v1/availability').send(data);
      expect(body.length).toEqual(3);
      expect(valeSchedule.timezone).toEqual('America/Bogota');
      expect(userTZ).toEqual('America/Bogota');
      expect(formatSlot(body[0], userTZ)).toEqual('09:00-09:15');
      expect(formatSlot(body[1], userTZ)).toEqual('09:20-09:35');
      expect(formatSlot(body[2], userTZ)).toEqual('09:40-09:55');
    });
  });

  afterEach(async () => {
    server.close();
    await conn?.connection?.close();
  });
});
