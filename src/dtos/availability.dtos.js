const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { listTimeZones } = require('timezone-support');

const date = Joi.date();
const timezone = Joi.string().valid(...listTimeZones());
const scheduleId = Joi.objectId();

const checkAvailabilityDto = Joi.object({
  date: date.required(),
  timezone: timezone.required(),
  scheduleId: scheduleId.required(),
});

module.exports = { checkAvailabilityDto };
