import Joi from 'joi';

const create = Joi.object({
  type: Joi.string()
    .valid("income", "expense")
    .required(),

  description: Joi.string()
    .required(),

  date: Joi.date()
    .required(),

  time: Joi.string()
    .required(),
  category_id: Joi.when("type", {
        is: "income",

        then: Joi.number()
          .integer()
          .required(),

        otherwise: Joi.optional(),
      }),
  note: Joi.string()
    .allow("")
    .optional(),

  amount: Joi.when("type", {
    is: "income",

    then: Joi.number()
      .positive()
      .required(),

    otherwise: Joi.optional(),
  }),

  items: Joi.when("type", {
    is: "expense",

    then: Joi.array()
      .items(
        Joi.object({
          name: Joi.string()
            .required(),

          qty: Joi.number()
            .integer()
            .min(1)
            .required(),

          price: Joi.number()
            .positive()
            .required(),

          category_id: Joi.number()
            .integer()
            .required(),
        })
      )
      .min(1)
      .required(),
    otherwise: Joi.optional(),
  }),
});

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

  startDate: Joi.date()
    .optional(),

  endDate: Joi.date()
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
  id: Joi.number()
    .integer()
    .required(),
});

export default { create, query, summary, getID };