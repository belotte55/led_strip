/* eslint-disable no-bitwise */

'use strict';

const uuid = require('uuid');
const dayjs = require('dayjs');
const ws281x = require('rpi-ws281x-native');

// Modules
const redis = require('../../modules/redis');

const stripService = {
  createStrip: async (length, name) => {
    const formattedNow = dayjs().format();
    const stripId = uuid.v4();
    if (!length) {
      length = +process.env.STRIP_LENGTH;
    }
    const strip = {
      id: stripId,
      type: 'strip',
      name: name || stripId,

      length,
      pixels: Array(length).fill('0x00000000'),
      createdAt: formattedNow,
      updatedAt: formattedNow,
    };

    await redis.jsonSet(strip.id, strip);
    await redis.sadd('STRIPS', strip.id);

    return strip;
  },

  getStripsIds: async () => {
    const stripsIds = await redis.smembers('STRIPS');
    return stripsIds;
  },

  getStrips: async () => {
    const stripsIds = await stripService.getStripsIds();
    return Promise.all(stripsIds.map(stripService.getStrip));
  },

  getStrip: stripId => redis.jsonGet(stripId),

  upsertStrip: strip => redis.jsonSet(strip.id, strip),

  removeStrip: async (stripId) => {
    if (await redis.sismember('STRIPS', stripId)) {
      await Promise.all([
        redis.srem('STRIPS', stripId),
        redis.del(stripId),
      ]);
    }
  },

  renderStrip: async (stripId) => {
    const strip = await redis.jsonGet(stripId);

    if (!strip) {
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    ws281x.init(strip.length);
    ws281x.setBrightness(0xFF * 0.8);

    const pixels = strip.pixels.map((pixel) => {
      const brightness = (+pixel & 0xFF) / 0xFF;
      const color = (+pixel / 0x100);
      const g = (color / 0x10000) | 0;
      const r = (color / 0x100) & 0xFF;
      const b = color & 0xFF;
      return parseInt((parseInt(r * brightness, 10) * 0x010000 + parseInt(g * brightness, 10) * 0x000100 + parseInt(b * brightness, 10) * 0x000001), 10);
    });

    ws281x.render(pixels);
  },

  updatePixel: async (stripId, index, color, brightness) => {
    const strip = await redis.jsonGet(stripId);

    if (!strip) {
      return;
    }
    if (index >= strip.length) {
      return;
    }
    strip.pixels[index] = `0x${`00000000${(color * 0x100 + brightness).toString(16)}`.slice(-8)}`;

    await stripService.upsertStrip(strip);
    await stripService.renderStrip(stripId);
  },

  updatePixels: async (stripId, pixels) => {
    const strip = await redis.jsonGet(stripId);

    if (!strip) {
      return;
    }
    if (pixels.length > strip.length) {
      return;
    }
    strip.pixels = pixels.map((pixel, index) => {
      if (pixel === null) {
        return strip.pixels[index];
      }
      if (typeof pixel === 'string') {
        if (pixel.substring(0, 1) === '#') {
          pixel = pixel.substring(1);
        } else if (pixel.substring(0, 2) === '0x') {
          pixel = pixel.substring(2);
        }
        return `0x${`${pixel}FF`.substring(0, 8)}`;
      }
      if (typeof pixel === 'number') {
        return pixel.toString(16);
      }
      return '0x00000000';
    });

    await stripService.upsertStrip(strip);
    await stripService.renderStrip(stripId);
  },
};

module.exports = stripService;
