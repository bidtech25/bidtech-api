import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load env from one level up or current dir
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: fs.existsSync(envPath) ? envPath : path.resolve(__dirname, '.env') });

const prisma = new PrismaClient();

const commands = [
  // 1. CLEANUP
  `DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;`,
  `DROP FUNCTION IF EXISTS public.handle_new_user;`,
  `DROP TABLE IF EXISTS public.process_attachments CASCADE;`,
  `DROP TABLE IF EXISTS public.ai_insights CASCADE;`,
  `DROP TABLE IF EXISTS public.processes CASCADE;`,
  `DROP TABLE IF EXISTS public.profiles CASCADE;`,
  `DROP TABLE IF EXISTS public.positions CASCADE;`,
  `DROP TABLE IF EXISTS public.sectors CASCADE;`,
  `DROP TABLE IF EXISTS public.companies CASCADE;`,
  `DROP TYPE IF EXISTS public."Role";`,
  `DROP TYPE IF EXISTS public."ProcessStatus";`,

  // 2. ENUMS
  `CREATE TYPE public."Role" AS ENUM ('SUPER_ADMIN', 'COMPANY_ADMIN', 'USER');`,
  `CREATE TYPE public."ProcessStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');`,

  // 3. COMPANIES
  `CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );`,

  // 4. SECTORS
  `CREATE TABLE public.sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );`,

  // 5. POSITIONS
  `CREATE TABLE public.positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );`,

  // 6. PROFILES
  `CREATE TABLE public.profiles (
    id UUID PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    sector_id UUID REFERENCES public.sectors(id) ON DELETE SET NULL,
    position_id UUID REFERENCES public.positions(id) ON DELETE SET NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(22),
    role public."Role" DEFAULT 'USER',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );`,

  // 7. PROCESSES (JSONB for steps, sipoc, stakeholders)
  `CREATE TABLE public.processes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    sector_id UUID REFERENCES public.sectors(id) ON DELETE SET NULL,
    owner_id UUID REFERENCES public.profiles(id),
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id),
    code VARCHAR(50),
    title VARCHAR(200) NOT NULL,
    version VARCHAR(10) DEFAULT '1.0',
    status public."ProcessStatus" DEFAULT 'DRAFT',
    objective TEXT,
    scope_in TEXT[],
    scope_out TEXT[],
    steps JSONB DEFAULT '[]',
    sipoc JSONB DEFAULT '{}',
    stakeholders JSONB DEFAULT '[]',
    bpmn_xml TEXT,
    bpmn_image_url TEXT,
    reviewed_at TIMESTAMPTZ,
    approved_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT processes_code_company_unique UNIQUE (company_id, code)
  );`,

  // 8. ATTACHMENTS
  `CREATE TABLE public.process_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_id UUID NOT NULL REFERENCES public.processes(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    size_bytes INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );`,

  // 9. TRIGGER FUNCTION
  `CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger AS $$
  BEGIN
    INSERT INTO public.profiles (id, email, name, role)
    VALUES (
      NEW.id, 
      NEW.email, 
      COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
      COALESCE((NEW.raw_user_meta_data->>'role')::public."Role", 'USER'::public."Role")
    );
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;`,

  // 10. TRIGGER
  `CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();`
];

async function main() {
  console.log('Applying SQL commands sequentially...');
  
  for (const [index, cmd] of commands.entries()) {
    try {
      console.log(`Executing command ${index + 1}/${commands.length}...`);
      await prisma.$executeRawUnsafe(cmd);
    } catch (e) {
      console.error(`Error executing command ${index + 1}:`, e);
      // Optional: stop on error or continue? 
      // Cleanups might fail if not exist, so we warn. 
      // But Create tables MUST succeed.
      if (index > 8) process.exit(1); 
    }
  }
  console.log('All commands executed.');
}

main();
