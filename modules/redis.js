'use strict';

const client = require('redis').createClient();

client.on('error', (error) => {
  console.error('Redis error.');
  console.error(error);
});

const redis = {
  set: (key, value) => new Promise((resolve, reject) => client.set(key, value, (error) => {
    if (error) {
      return reject(error);
    }
    return resolve(value);
  })),

  get: key => new Promise((resolve, reject) => client.get(key, (error, value) => {
    if (error) {
      return reject(error);
    }
    return resolve(value);
  })),

  del: key => new Promise((resolve, reject) => client.del(key, (error) => {
    if (error) {
      return reject(error);
    }
    return resolve();
  })),
};

module.exports = redis;
