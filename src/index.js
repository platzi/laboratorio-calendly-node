const getConnection = require('./database/connection');
const createApp = require('./app');

getConnection();
const app = createApp();
app.listen(process.env.PORT || 3002);

module.exports = app;
