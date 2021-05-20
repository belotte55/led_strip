'use strict';

const router = require('express').Router();

router.route('/')
  .get(async (req, res) => res.end());

module.exports = router;
