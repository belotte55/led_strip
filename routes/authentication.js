'use strict';

const router = require('express').Router();

router.route('*')
  .get(async (req, res, next) => {
    if (req.headers.authorization !== global.API_KEY && req.query.token !== global.API_KEY) {
      return res.status(401).end();
    }

    return next();
  });

module.exports = router;
