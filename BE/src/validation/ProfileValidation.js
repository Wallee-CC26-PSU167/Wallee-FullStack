import Joi from 'joi';

const update = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50),

  email: Joi.string()
    .email(),

  currentPassword: Joi.string()
    .when('newPassword', {
      is:   Joi.exist(),
      then: Joi.required(),
    }),

  newPassword: Joi.string()
    .min(6),
}).min(1);

export default { update };