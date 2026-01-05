"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: fs.existsSync(envPath) ? envPath : path.resolve(__dirname, '.env') });
const prisma = new client_1.PrismaClient();
const commands = [
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
    `CREATE TYPE public."Role" AS ENUM ('SUPER_ADMIN', 'COMPANY_ADMIN', 'USER');`,
    `CREATE TYPE public."ProcessStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');`,
    `CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );`,
    `CREATE TABLE public.sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );`,
    `CREATE TABLE public.positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );`,
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
    `CREATE TABLE public.process_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_id UUID NOT NULL REFERENCES public.processes(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    size_bytes INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );`,
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
        }
        catch (e) {
            console.error(`Error executing command ${index + 1}:`, e);
            if (index > 8)
                process.exit(1);
        }
    }
    console.log('All commands executed.');
}
main();
//# sourceMappingURL=apply-sql.js.map