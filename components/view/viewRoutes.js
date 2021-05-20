'use strict';

const router = require('express').Router();

// Services
const stripService = require('../strip/stripService');

router.route('/')
  .get(async (req, res) => {
    const strips = await stripService.getStrips();
    return res.render('index', {
      strips,
      stripLength: process.env.STRIP_LENGTH,
    });
  });

router.route('/strip/:stripId')
  .patch(async (req, res) => {
    // Register strip
  })
  .get(async (req, res) => {
    const { stripId } = req.params;
    const strip = await stripService.getStrip(stripId);
    return res.render('strip', {
      strip,
    });
  });

module.exports = router;
