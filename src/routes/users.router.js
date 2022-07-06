const express = require('express');

const validatorHandler = require('./../middlewares/validator.handler');
const UserService = require('./../services/user.service');
const ScheduleService = require('./../services/schedule.service');
const { createUserDto, getUserDto, updateUserDto } = require('./../dtos/user.dtos');

const router = express.Router();
const userService = new UserService();
const scheduleService = new ScheduleService();

router.get('/', async (_, res, next) => {
  try {
    const products = await userService.getAll();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  validatorHandler(getUserDto, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await userService.getById(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:id/schedules',
  validatorHandler(getUserDto, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await scheduleService.getByUser(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  validatorHandler(createUserDto, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newUser = await userService.create(body);
      res.json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  validatorHandler(getUserDto, 'params'),
  validatorHandler(updateUserDto, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const user = await userService.update(id, body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
