const express = require('express');
const { listTimeZones } = require('timezone-support');

const router = express.Router();

router.get('/', async (_, res, next) => {
  try {
    res.json(listTimeZones());
  } catch (error) {
    next(error);
  }
});

module.exports = router;
