import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  PORT: Joi.number().default(3001),
  JWT_KEY: Joi.required(),
  BD_NAME: Joi.required(),
  BD_PASSWORD: Joi.required(),
  BD_HOST: Joi.required(),
  BD_PORT: Joi.number().required(),
  BD_USERNAME: Joi.required(),
});
