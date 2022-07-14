const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const id = Joi.objectId();
const name = Joi.string().min(3).max(15);
const email = Joi.string().email();
const avatar = Joi.string().uri();
const password = Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'));

const createUserDto = Joi.object({
  name: name.required(),
  email: email.required(),
  avatar: avatar.required(),
  password: password.required(),
});

const updateUserDto = Joi.object({
  name,
  email,
  avatar,
  password
});

const getUserDto = Joi.object({
  id: id.required(),
});

module.exports = { createUserDto, updateUserDto, getUserDto };
