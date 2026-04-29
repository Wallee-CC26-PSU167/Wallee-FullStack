import Joi from 'joi';

const query = Joi.object({
  type: Joi.string()
    .valid('income', 'expense')
    .optional(),
});

export default { query };