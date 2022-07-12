const express = require('express');

const usersRouter = require('./users.router');
const schedulesRouter = require('./schedules.router');
const timezonesRouter = require('./timezones.router');
const appointmentsRouter = require('./appointments.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/users', usersRouter);
  router.use('/schedules', schedulesRouter);
  router.use('/timezones', timezonesRouter);
  router.use('/appointments', appointmentsRouter);
}

module.exports = routerApi;
