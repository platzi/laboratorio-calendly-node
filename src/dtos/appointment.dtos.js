const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const id = Joi.objectId();
const note = Joi.string().min(20);
const email = Joi.string().email();
const startDate = Joi.date().iso();
const endDate = Joi.date().iso();
const userId = Joi.objectId();

const createAppointmentDto = Joi.object({
  note: note.required(),
  email: email.required(),
  startDate: startDate.required(),
  endDate: endDate.required(),
  userId: userId.required(),
});

const getAppointmentDto = Joi.object({
  id: id.required(),
});

module.exports = { getAppointmentDto, createAppointmentDto };
