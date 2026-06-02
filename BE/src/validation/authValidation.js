import Joi from 'joi';

const register = Joi.object({
  nama: Joi.string()
    .min(2)
    .max(50)
    .required(),

  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .required(),
});

const login = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .required(),
});

const forgotPassword = Joi.object({
  email: Joi.string()
    .email()
    .required(),
});

const resetPassword = Joi.object({
  id: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  token: Joi.string().required(),
  newPassword: Joi.string()
    .min(6)
    .required(),
});

export default { register, login, forgotPassword, resetPassword };