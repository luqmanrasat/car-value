import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.valid('development', 'production', 'test').required(),
  DB_NAME: Joi.string().required(),
  COOKIE_KEY: Joi.string().required(),
});
