'use strict';

// eslint-disable-next-line no-return-assign
Object.keys(require('./.env')).forEach(key => process.env[key.toUpperCase()] = require('./.env')[key]);

require('colors');
const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');

// Services
const apiService = require('./components/api/apiService');

// Routes
const api = require('./components/api/apiRoutes');
const authentication = require('./components/authentication/authenticationRoutes');
const strip = require('./components/strip/stripRoutes');
const view = require('./components/view/viewRoutes');

const app = express();
const server = http.createServer(app);

app.set('view engine', 'pug');

app.use(express.json());
app.use(cookieParser());

app.use('/css', express.static('./assets/css'));

app.use('/', authentication, view);
app.use('/api/v1', authentication, api);
app.use('/api/v1/strips', authentication, strip);

app.use('*', (req, res) => res.status(404).end('404'));

server.listen(process.env.PORT, async () => {
  console.info(`Server running on port ${process.env.PORT.toString().cyan.bold}.`);
  console.info(`Environment: ${process.env.NODE_ENV.toUpperCase()[{
    test: 'blue',
    development: 'green',
    production: 'red',
  }[process.env.NODE_ENV] || 'blue'].bold}`);

  global.API_KEY = await apiService.initApiKey();
  console.info(`API_KEY: ${global.API_KEY.yellow.bold}`);
});
