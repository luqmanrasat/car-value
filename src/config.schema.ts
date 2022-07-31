import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.valid('development', 'production', 'test').required(),
  COOKIE_KEY: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
});
