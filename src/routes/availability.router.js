const express = require('express');

const validatorHandler = require('../middlewares/validator.handler');
const AvailabilityService = require('../services/availability.service');
const { checkAvailabilityDto } = require('../dtos/availability.dtos');

const router = express.Router();
const service = new AvailabilityService();

router.post(
  '/',
  validatorHandler(checkAvailabilityDto, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newUser = await service.check(body);
      res.json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
