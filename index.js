'use strict';

// eslint-disable-next-line no-return-assign
Object.keys(require('./.env')).forEach(key => process.env[key.toUpperCase()] = require('./.env')[key]);

require('colors');
const express = require('express');
const http = require('http');

// Services
const apiService = require('./components/api/apiService');

// Routes
const authentication = require('./routes/authentication');
const api = require('./routes/api');

const app = express();
const server = http.createServer(app);

app.use('/api/v1', authentication, api);

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
