import * as Joi from "joi";

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().default(3000),
  LOG_LEVEL: Joi.string().default("info"),
  DATABASE_URL: Joi.string().required(),
  DIRECT_URL: Joi.string().optional(),
  SUPABASE_URL: Joi.string().required(),
  SUPABASE_JWT_SECRET: Joi.string().required(),
  REDIS_HOST: Joi.string().default("localhost"),
  REDIS_PORT: Joi.number().default(6379),
  RABBITMQ_URL: Joi.string().required(),
  OPENAI_API_KEY: Joi.string().optional(),
});
