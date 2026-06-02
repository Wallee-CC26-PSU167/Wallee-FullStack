import Joi from 'joi';

const update = Joi.object({
  nama: Joi.string()
    .min(2)
    .max(50),

  email: Joi.string()
    .email(),
  password_hash: Joi.string()
    .min(6),
  currentPassword: Joi.string()
    .min(6)
    .allow('', null),

  newPassword: Joi.string()
    .min(6)
    .allow('', null),
}).min(1);

export default { update };