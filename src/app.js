const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');

const {
  logErrors,
  errorHandler,
  boomErrorHandler,
} = require('./middlewares/error.handler');

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  routerApi(app);

  app.use(logErrors);
  app.use(boomErrorHandler);
  app.use(errorHandler);
  return app;
};

module.exports = createApp;
