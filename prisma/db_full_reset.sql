-- 1. LIMPEZA (CUIDADO: Isso apaga tudo para recriar do zero)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user;
DROP TABLE IF EXISTS public.ai_insights;
DROP TABLE IF EXISTS public.process_attachments;
DROP TABLE IF EXISTS public.processes;
DROP TABLE IF EXISTS public.profiles;
DROP TABLE IF EXISTS public.companies;
DROP TYPE IF EXISTS public."Role";
DROP TYPE IF EXISTS public."ProcessStatus";

-- 2. CRIAÇÃO DOS TIPOS (ENUMS)
-- Aqui definimos a hierarquia de poder
CREATE TYPE public."Role" AS ENUM ('SUPER_ADMIN', 'COMPANY_ADMIN', 'USER');
CREATE TYPE public."ProcessStatus" AS ENUM ('DRAFT', 'PENDING', 'PUBLISHED', 'ARCHIVED');

-- 3. CRIAÇÃO DAS TABELAS

-- Empresas (Tenants)
CREATE TABLE public.companies (
  id text NOT NULL DEFAULT gen_random_uuid(), -- Gera UUID automático
  name text NOT NULL,
  cnpj text UNIQUE, -- Garante que não existam 2 empresas com mesmo CNPJ
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT companies_pkey PRIMARY KEY (id)
);

-- Perfis de Usuário (Espelho do Auth)
CREATE TABLE public.profiles (
  id text NOT NULL, -- O ID vem do Supabase Auth, não geramos aqui
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  role public."Role" NOT NULL DEFAULT 'USER'::public."Role",
  avatar_url text,
  company_id text, -- Pode ser NULL se for o SUPER_ADMIN
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_company_id_fkey FOREIGN KEY (company_id) 
    REFERENCES public.companies(id) ON DELETE SET NULL
);

-- Processos (O Coração do Bidtech)
CREATE TABLE public.processes (
  id text NOT NULL DEFAULT gen_random_uuid(),
  company_id text NOT NULL,
  created_by text NOT NULL,
  updated_by text,
  
  -- Etapa 1: Básico
  title text NOT NULL,
  code text,
  version text NOT NULL DEFAULT '1.0',
  status public."ProcessStatus" NOT NULL DEFAULT 'DRAFT'::public."ProcessStatus",
  
  -- Etapas 2, 3 e 4
  objective text,
  scope_in text[], -- Array de texto
  scope_out text[], -- Array de texto
  details jsonb, -- SIPOC e detalhes flexíveis
  
  -- Etapas 6 e 7
  bpmn_xml text,
  bpmn_image text,
  reviewed_at timestamp with time zone,
  approved_by text, -- ID de quem aprovou

  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  CONSTRAINT processes_pkey PRIMARY KEY (id),
  CONSTRAINT processes_company_id_fkey FOREIGN KEY (company_id) 
    REFERENCES public.companies(id) ON DELETE CASCADE, -- Se apagar empresa, somem os processos
  CONSTRAINT processes_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id),
  CONSTRAINT processes_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.profiles(id)
);

-- Anexos
CREATE TABLE public.process_attachments (
  id text NOT NULL DEFAULT gen_random_uuid(),
  process_id text NOT NULL,
  name text NOT NULL,
  url text NOT NULL,
  file_type text NOT NULL,
  size integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT process_attachments_pkey PRIMARY KEY (id),
  CONSTRAINT process_attachments_process_id_fkey FOREIGN KEY (process_id) 
    REFERENCES public.processes(id) ON DELETE CASCADE
);

-- Insights de IA (Mantendo sua tabela nova)
CREATE TABLE public.ai_insights (
  id text NOT NULL DEFAULT gen_random_uuid(),
  process_id text NOT NULL,
  status text NOT NULL DEFAULT 'processing',
  result jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT ai_insights_pkey PRIMARY KEY (id),
  CONSTRAINT ai_insights_process_id_fkey FOREIGN KEY (process_id) 
    REFERENCES public.processes(id) ON DELETE CASCADE
);

-- 4. A MÁGICA: TRIGGER DE AUTOMAÇÃO (CRUCIAL!)
-- Essa função conecta o Login do Supabase com a sua tabela de Perfis

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    new.id, 
    new.email, 
    -- Pega o nome dos metadados ou usa parte do email
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    -- Define a role que veio na criação (SUPER_ADMIN, COMPANY_ADMIN ou USER)
    COALESCE((new.raw_user_meta_data->>'role')::public."Role", 'USER'::public."Role")
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ativa o gatilho
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
