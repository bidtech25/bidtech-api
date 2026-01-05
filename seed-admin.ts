import { PrismaClient, Role } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: fs.existsSync(envPath) ? envPath : path.resolve(__dirname, '../.env') });

// V3: Schema uses 'profiles' (lowercase in DB, PascalCase in Prisma)
const prisma = new PrismaClient();

// Support both variable names
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_JWT_SECRET;

if (!process.env.SUPABASE_URL || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/SUPABASE_JWT_SECRET in .env");
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  serviceRoleKey
);

async function main() {
  const email = 'admin@bidtech.internal';
  const password = 'Mudar@123';
  const name = 'Super Admin';

  console.log(`Creating Super Admin: ${email}`);

  // 1. Create in Supabase Auth
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, role: 'SUPER_ADMIN', is_first_login: true },
  });

  if (error) {
    if (!error.message?.includes('already registered')) {
      console.error('Supabase Auth Error:', error.message);
    } else {
      console.log("User already in Supabase Auth.");
    }
  }

  let userId = data?.user?.id;

  if (!userId) {
    // Try to find existing user
    const { data: users } = await supabase.auth.admin.listUsers();
    const found = users?.users?.find((u: any) => u.email === email);
    if (found) userId = found.id;
  }

  if (!userId) {
    console.error('Could not determine User ID. Exiting.');
    return;
  }

  console.log(`Supabase User ID: ${userId}`);

  // 2. Create/Update in Prisma (V3: Profile model)
  const profile = await prisma.profile.upsert({
    where: { id: userId },
    update: {
      role: Role.SUPER_ADMIN,
    },
    create: {
      id: userId,
      email,
      name,
      role: Role.SUPER_ADMIN,
    },
  });

  console.log('Super Admin Profile Configured:', profile);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
