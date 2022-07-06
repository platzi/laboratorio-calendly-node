const express = require('express');

const validatorHandler = require('../middlewares/validator.handler');
const ScheduleService = require('../services/schedule.service');
const { createScheduleDto, getScheduleDto, updateScheduleDto } = require('../dtos/schedule.dtos');

const router = express.Router();
const service = new ScheduleService();

router.get('/', async (_, res, next) => {
  try {
    const products = await service.getAll();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  validatorHandler(getScheduleDto, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await service.getById(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  validatorHandler(createScheduleDto, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newUser = await service.create(body);
      res.json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  validatorHandler(getScheduleDto, 'params'),
  validatorHandler(updateScheduleDto, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const user = await service.update(id, body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
