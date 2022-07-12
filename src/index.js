const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');
const getConnection = require('./libs/mongoose');

const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/error.handler');

const app = express();
const port = process.env.PORT || 3000;

getConnection();
app.use(express.json());
app.use(cors());

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);


app.listen(port, () => {
  console.log('Starting in port:' +  port);
});

module.exports = app;
