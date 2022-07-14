const supertest = require('supertest');
const { utcToZonedTime, format: formatTz } = require('date-fns-tz');

const createApp = require('../src/app');
const getConnection = require('../src/database/connection');
const User = require('../src/database/entities/user.entity');
const Schedule = require('../src/database/entities/schedule.entity');
const initSeedDB = require('../src/database/seeds/init.seed');

const formatSlot = (slot, userTZ) => {
  const startDate = new Date(slot.start);
  const zonedStartTime = utcToZonedTime(startDate, userTZ);
  const hourStartTime = formatTz(zonedStartTime, 'HH:mm', { timeZone: userTZ });

  const endDate = new Date(slot.end);
  const zonedEndTime = utcToZonedTime(endDate, userTZ);
  const hourEndTime = formatTz(zonedEndTime, 'HH:mm', { timeZone: userTZ });
  return `${hourStartTime}-${hourEndTime}`;
};

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

  describe('Generating slots - 09:00 - 10:00', () => {
    test('should return empty array', async () => {
      const valeUser = await User.findOne({ email: 'vale@mail.com' });
      const valeSchedule = await Schedule.findOne({ user: valeUser._id });

      const userTZ = valeSchedule.timezone;

      const data = {
        date: '2022-07-19',
        scheduleId: valeSchedule._id,
        timezone: userTZ,
      };
      const { body } = await api.post('/api/v1/availability').send(data);
      expect(body.length).toEqual(0);
    });
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
    test('should return slots with diff timezone', async () => {
      const valeUser = await User.findOne({ email: 'vale@mail.com' });
      const valeSchedule = await Schedule.findOne({ user: valeUser._id });

      const userTZ = 'America/La_Paz';

      const data = {
        date: '2022-07-18',
        scheduleId: valeSchedule._id,
        timezone: userTZ,
      };
      const { body } = await api.post('/api/v1/availability').send(data);
      expect(body.length).toEqual(3);
      expect(valeSchedule.timezone).toEqual('America/Bogota');
      expect(userTZ).toEqual('America/La_Paz');
      expect(formatSlot(body[0], userTZ)).toEqual('10:00-10:15');
      expect(formatSlot(body[1], userTZ)).toEqual('10:20-10:35');
      expect(formatSlot(body[2], userTZ)).toEqual('10:40-10:55');
    });
  });

  describe('Generating slots - 09:00 - 10:15', () => {
    test('should return empty array', async () => {
      const santiUser = await User.findOne({ email: 'santi@mail.com' });
      const santiSchedule = await Schedule.findOne({ user: santiUser._id });

      const userTZ = santiSchedule.timezone;

      const data = {
        date: '2022-07-19',
        scheduleId: santiSchedule._id,
        timezone: userTZ,
      };
      const { body } = await api.post('/api/v1/availability').send(data);
      expect(body.length).toEqual(0);
    });
    test('should return slots with the same timezone', async () => {
      const santiUser = await User.findOne({ email: 'santi@mail.com' });
      const santiSchedule = await Schedule.findOne({ user: santiUser._id });

      const userTZ = santiSchedule.timezone;

      const data = {
        date: '2022-07-18',
        scheduleId: santiSchedule._id,
        timezone: userTZ,
      };
      const { body } = await api.post('/api/v1/availability').send(data);
      expect(body.length).toEqual(4);
      expect(santiSchedule.timezone).toEqual('America/Bogota');
      expect(userTZ).toEqual('America/Bogota');
      expect(formatSlot(body[0], userTZ)).toEqual('09:00-09:15');
      expect(formatSlot(body[1], userTZ)).toEqual('09:20-09:35');
      expect(formatSlot(body[2], userTZ)).toEqual('09:40-09:55');
      expect(formatSlot(body[3], userTZ)).toEqual('10:00-10:15');
    });
    test('should return slots with diff timezone', async () => {
      const santiUser = await User.findOne({ email: 'santi@mail.com' });
      const santiSchedule = await Schedule.findOne({ user: santiUser._id });

      const userTZ = 'America/La_Paz';

      const data = {
        date: '2022-07-18',
        scheduleId: santiSchedule._id,
        timezone: userTZ,
      };
      const { body } = await api.post('/api/v1/availability').send(data);
      expect(body.length).toEqual(4);
      expect(santiSchedule.timezone).toEqual('America/Bogota');
      expect(userTZ).toEqual('America/La_Paz');
      expect(formatSlot(body[0], userTZ)).toEqual('10:00-10:15');
      expect(formatSlot(body[1], userTZ)).toEqual('10:20-10:35');
      expect(formatSlot(body[2], userTZ)).toEqual('10:40-10:55');
      expect(formatSlot(body[3], userTZ)).toEqual('11:00-11:15');
    });
  });

  describe('Generating slots with multiples intervals', () => {

    test('should return slots with the same timezone', async () => {
      const nicoUser = await User.findOne({ email: 'nico@mail.com' });
      const nicoSchedule = await Schedule.findOne({ user: nicoUser._id });

      const userTZ = nicoSchedule.timezone;

      const data = {
        date: '2022-07-18',
        scheduleId: nicoSchedule._id,
        timezone: userTZ,
      };
      const { body } = await api.post('/api/v1/availability').send(data);
      expect(body.length).toEqual(4);
      expect(nicoSchedule.timezone).toEqual('America/La_Paz');
      expect(userTZ).toEqual('America/La_Paz');
      expect(formatSlot(body[0], userTZ)).toEqual('10:00-10:30');
      expect(formatSlot(body[1], userTZ)).toEqual('10:35-11:05');
      expect(formatSlot(body[2], userTZ)).toEqual('11:10-11:40');
      expect(formatSlot(body[3], userTZ)).toEqual('20:00-20:30');
    });
    test('should return slots with diffs timezone', async () => {
      const nicoUser = await User.findOne({ email: 'nico@mail.com' });
      const nicoSchedule = await Schedule.findOne({ user: nicoUser._id });

      const userTZ = 'America/Bogota';

      const data = {
        date: '2022-07-18',
        scheduleId: nicoSchedule._id,
        timezone: userTZ,
      };
      const { body } = await api.post('/api/v1/availability').send(data);
      expect(body.length).toEqual(4);
      expect(nicoSchedule.timezone).toEqual('America/La_Paz');
      expect(userTZ).toEqual('America/Bogota');
      expect(formatSlot(body[0], userTZ)).toEqual('09:00-09:30');
      expect(formatSlot(body[1], userTZ)).toEqual('09:35-10:05');
      expect(formatSlot(body[2], userTZ)).toEqual('10:10-10:40');
      expect(formatSlot(body[3], userTZ)).toEqual('19:00-19:30');
    });
  });

  describe('Booking', () => {
    test('should return a slot in off', async () => {
      const nicoUser = await User.findOne({ email: 'nico@mail.com' });
      const nicoSchedule = await Schedule.findOne({ user: nicoUser._id });

      const userTZ = nicoSchedule.timezone;

      const data = {
        date: '2022-07-18',
        scheduleId: nicoSchedule._id,
        timezone: userTZ,
      };
      const response = await api.post('/api/v1/availability').send(data);

      expect(nicoSchedule.timezone).toEqual('America/La_Paz');
      expect(userTZ).toEqual('America/La_Paz');

      const appointment = response.body[0];

      const responseAppointment = await api.post('/api/v1/appointments').send({
        userId: nicoUser._id,
        startDate: new Date(appointment.start).toISOString(),
        endDate: new Date(appointment.end).toISOString(),
        note: 'bla bla bla bla bla bla bla',
        email: 'nico@example.com'
      });
      expect(responseAppointment.status).toEqual(200);

      const { body } = await api.post('/api/v1/availability').send(data);
      expect(body[0].status).toEqual('off');
    });
  })

  afterEach(async () => {
    server.close();
    await conn?.connection?.close();
  });
});
