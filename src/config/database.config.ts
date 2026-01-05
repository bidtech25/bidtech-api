import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  directUrl: process.env.DIRECT_URL,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET,
}));
