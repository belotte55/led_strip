'use strict';

const client = require('redis').createClient();

client.on('error', (error) => {
  console.error('Redis error.');
  console.error(error);
});

const redis = {};

[
  'blmove',
  'blpop',
  'brpop',
  'brpoplpush',
  'del',
  'get',
  'hdel',
  'hexists',
  'hget',
  'hgetall',
  'hincrby',
  'hincrbyfloat',
  'hkeys',
  'hlen',
  'hmget',
  'hmset',
  'hrandfield',
  'hscan',
  'hset',
  'hsetnx',
  'hstrlen',
  'hvals',
  'lindex',
  'linsert',
  'llen',
  'lmove',
  'lpop',
  'lpos',
  'lpush',
  'lpushx',
  'lrange',
  'lrem',
  'lset',
  'ltrim',
  'rpop',
  'rpoplpush',
  'rpush',
  'rpushx',
  'sadd',
  'scard',
  'sdiff',
  'sdiffstore',
  'set',
  'sinter',
  'sinterstore',
  'sismember',
  'smembers',
  'smismember',
  'smove',
  'spop',
  'srandmember',
  'srem',
  'sscan',
  'sunion',
  'sunionstore',
].forEach((key) => {
  redis[key] = (...params) => new Promise((resolve, reject) => client[key](...params, (error, response) => {
    if (error) {
      return reject(error);
    }
    return resolve(response);
  }));
});

redis.jsonSet = (id, value) => redis.set(id, JSON.stringify(value));

redis.jsonGet = async (id) => {
  const value = await redis.get(id);
  return JSON.parse(value);
};

module.exports = redis;
