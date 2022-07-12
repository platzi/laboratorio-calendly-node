const Joi = require('joi');

const intervalDto = Joi.object({
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
});

const availabilityDto = Joi.object({
  day: Joi.string().valid(
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
  ),
  intervals: Joi.array().items(intervalDto),
});

const id = Joi.string();
const title = Joi.string().min(3).max(50);
const description = Joi.string().min(20);
const duration = Joi.number().min(0);
const margin = Joi.number().min(0);
const timezone = Joi.string();
const availability = Joi.array().items(availabilityDto);
const userId = Joi.string();

const createScheduleDto = Joi.object({
  title: title.required(),
  description: description.required(),
  duration: duration.required(),
  margin: margin.required(),
  timezone: timezone.required(),
  availability: availability.required(),
  userId: userId.required(),
});

const updateScheduleDto = Joi.object({
  title,
  description,
  duration,
  margin,
  timezone,
  availability,
  userId,
});

const getScheduleDto = Joi.object({
  id: id.required(),
});

module.exports = { createScheduleDto, updateScheduleDto, getScheduleDto };
