import Joi from 'joi';

const create = Joi.object({
  amount: Joi.number()
    .positive()
    .required(),

  type: Joi.string()
    .valid('income', 'expense')
    .required(),

  date: Joi.string()
    .isoDate()
    .required(),

  category_id: Joi.string()
    .uuid()
    .optional()
    .allow(null),

  description: Joi.string()
    .max(255)
    .optional()
    .allow('')
    .allow(null),
});

const update = Joi.object({
  amount: Joi.number()
    .positive()
    .optional(),

  type: Joi.string()
    .valid('income', 'expense')
    .optional(),

  date: Joi.string()
    .isoDate()
    .optional(),

  category_id: Joi.string()
    .uuid()
    .optional()
    .allow(null),

  description: Joi.string()
    .max(255)
    .optional()
    .allow('')
    .allow(null),
}).min(1);

const query = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10),

  type: Joi.string()
    .valid("income", "expense")
    .optional(),
});

const summary = Joi.object({
  month: Joi.number()
    .integer()
    .min(1)
    .max(12)
    .optional(),

  year: Joi.number()
    .integer()
    .min(2016)
    .max(2050)
    .optional(),
});
const getID = Joi.object({
  id: Joi.string()
    .uuid()
    .required(),
});

export default { create, update, query, summary, getID };