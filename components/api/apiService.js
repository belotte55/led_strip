/* eslint-disable no-return-await */

'use strict';

const uuid = require('uuid');

// Modules
const redis = require('../../modules/redis');

const apiService = {
  generateApiKey: () => {
    const apiKey = uuid.v4();
    return redis.set('API_KEY', apiKey);
  },

  initApiKey: async () => ((await apiService.getApiKey()) || (await apiService.generateApiKey())),

  getApiKey: () => redis.get('API_KEY'),
};

module.exports = apiService;
