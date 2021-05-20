/* eslint-disable no-return-await */

'use strict';

const uuid = require('uuid');
const md5 = require('md5');

// Modules
const redis = require('../../modules/redis');

const apiService = {
  generateApiKey: () => {
    const uid = uuid.v4();
    const apiKey = `${uid.split('-').join('')}${md5(uuid)}`;
    return redis.set('API_KEY', apiKey);
  },

  initApiKey: async () => ((await apiService.getApiKey()) || (await apiService.generateApiKey())),

  getApiKey: () => redis.get('API_KEY'),
};

module.exports = apiService;
