'use strict';

const router = require('express').Router();

// Services
const stripService = require('./stripService');

router.route('/')
  .post(async (req, res) => {
    const { length, name } = req.body;
    const strip = await stripService.createStrip(length, name);
    return res.json(strip);
  })
  .get(async (req, res) => {
    const stripsIds = await stripService.getStripsIds();
    return res.json({ stripsIds });
  });

router.route('/:stripId')
  .patch(async (req, res) => {
    // Register strip
  })
  .get(async (req, res) => {
    const { stripId } = req.params;
    const strip = await stripService.getStrip(stripId);
    return res.json(strip);
  })
  .delete(async (req, res) => {
    const { stripId } = req.params;
    await stripService.removeStrip(stripId);
    return res.json({ success: true });
  });

router.route('/:stripId/render')
  .patch(async (req, res) => {
    const { stripId } = req.params;
    await stripService.renderStrip(stripId);
    return res.end();
  })
  .get(async (req, res) => {
    const { stripId } = req.params;
    const strip = await stripService.getStrip(stripId);
    return res.json(strip);
  })
  .delete(async (req, res) => {
    const { stripId } = req.params;
    await stripService.removeStrip(stripId);
    return res.json({ success: true });
  });

router.route('/:stripId/pixels')
  .patch(async (req, res) => {
    const { stripId } = req.params;
    const { pixels } = req.body;
    await stripService.updatePixels(stripId, pixels);
    return res.end();
  });

router.route('/:stripId/pixel/:index')
  .patch(async (req, res) => {
    const { stripId, index } = req.params;
    const { color, brightness } = req.body;
    await stripService.updatePixel(stripId, +index, +color, +brightness);
    return res.end();
  });

module.exports = router;
