import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT ?? '3000', 10),
  logLevel: process.env.LOG_LEVEL,
  openaiApiKey: process.env.OPENAI_API_KEY,
}));
