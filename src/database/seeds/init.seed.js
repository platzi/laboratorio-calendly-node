/* eslint-disable no-console */
const getConnection = require('../connection');
const User = require('../entities/user.entity');
const Schedule = require('../entities/schedule.entity');

const initSeedDB = async () => {
  try {
    const conn = await getConnection();
    await conn.connection.dropDatabase();

    const nicoUser = new User({
      name: 'Nicolas',
      email: 'nico@mail.com',
      password: 'changeme',
      avatar: `https://api.lorem.space/image/face?w=480&h=480&r=${Math.random()}`,
    });
    await nicoUser.save();

    const nicoScheduleFrontend = new Schedule({
      user: nicoUser._id,
      title: 'Mentorias de Frontend',
      description:
        'Este espacio está creado para que hablemos sobre tus dudas técnicas y los bloqueos que tengas respecto a Frontend.',
      duration: 30,
      margin: 5,
      timezone: 'America/La_Paz',
      availability: [
        {
          day: 'monday',
          intervals: [
            {
              startTime: '10:00',
              endTime: '12:00',
            },
            {
              startTime: '20:00',
              endTime: '21:00',
            },
          ],
        },
        {
          day: 'wednesday',
          intervals: [
            {
              startTime: '18:00',
              endTime: '19:00',
            },
          ],
        },
      ],
    });
    await nicoScheduleFrontend.save();

    const nicoScheduleBackend = new Schedule({
      user: nicoUser._id,
      title: 'Mentorias de Backend',
      description:
        'Este espacio está creado para que hablemos sobre tus dudas técnicas y los bloqueos que tengas respecto a Backend.',
      duration: 30,
      margin: 5,
      timezone: 'America/La_Paz',
      availability: [
        {
          day: 'friday',
          intervals: [
            {
              startTime: '15:00',
              endTime: '18:00',
            },
          ],
        },
      ],
    });
    await nicoScheduleBackend.save();

    const zuleUser = new User({
      name: 'Zulema',
      email: 'zule@mail.com',
      password: 'changeme',
      avatar: `https://api.lorem.space/image/face?w=480&h=480&r=${Math.random()}`,
    });
    await zuleUser.save();

    const zuleSchedule = new Schedule({
      user: zuleUser._id,
      title: 'Soporte',
      description:
        'Un espacio para hablar sobre la experiencia con el sistema.',
      duration: 25,
      margin: 5,
      timezone: 'America/La_Paz',
      availability: [
        {
          day: 'tuesday',
          intervals: [
            {
              startTime: '10:00',
              endTime: '15:00',
            },
          ],
        },
      ],
    });
    await zuleSchedule.save();

    const valeUser = new User({
      name: 'Valentina',
      email: 'vale@mail.com',
      password: 'changeme',
      avatar: `https://api.lorem.space/image/face?w=480&h=480&r=${Math.random()}`,
    });
    await valeUser.save();

    const valeSchedule = new Schedule({
      user: valeUser._id,
      title: 'Soporte',
      description:
        'Un espacio para hablar sobre la experiencia con el sistema.',
      duration: 15,
      margin: 5,
      timezone: 'America/Bogota',
      availability: [
        {
          day: 'monday',
          intervals: [
            {
              startTime: '09:00',
              endTime: '10:00',
            },
          ],
        },
      ],
    });
    await valeSchedule.save();

    const santiUser = new User({
      name: 'Santiago',
      email: 'santi@mail.com',
      password: 'changeme',
      avatar: `https://api.lorem.space/image/face?w=480&h=480&r=${Math.random()}`,
    });
    await santiUser.save();

    const santiSchedule = new Schedule({
      user: santiUser._id,
      title: 'Soporte',
      description:
        'Un espacio para hablar sobre la experiencia con el sistema.',
      duration: 15,
      margin: 5,
      timezone: 'America/Bogota',
      availability: [
        {
          day: 'monday',
          intervals: [
            {
              startTime: '09:00',
              endTime: '10:15',
            },
          ],
        },
      ],
    });
    await santiSchedule.save();
  } catch (error) {
    console.error(error);
  }
};

module.exports = initSeedDB;
