const express = require('express');

const validatorHandler = require('../middlewares/validator.handler');
const AppointmentService = require('../services/appointment.service');
const { getAppointmentDto, createAppointmentDto } = require('../dtos/appointment.dtos');

const router = express.Router();
const service = new AppointmentService();

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
  validatorHandler(getAppointmentDto, 'params'),
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
  validatorHandler(createAppointmentDto, 'body'),
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

module.exports = router;
