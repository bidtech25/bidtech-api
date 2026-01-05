-- CreateTable
CREATE TABLE "tb_usuarios" (
    "id" TEXT NOT NULL,
    "supabase_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_processos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_processos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_analyses" (
    "id" TEXT NOT NULL,
    "process_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "result" JSONB,
    "error" TEXT,
    "model" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "ai_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_usuarios_supabase_id_key" ON "tb_usuarios"("supabase_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_usuarios_email_key" ON "tb_usuarios"("email");

-- CreateIndex
CREATE INDEX "ai_analyses_process_id_idx" ON "ai_analyses"("process_id");

-- CreateIndex
CREATE INDEX "ai_analyses_status_idx" ON "ai_analyses"("status");

-- AddForeignKey
ALTER TABLE "tb_processos" ADD CONSTRAINT "tb_processos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tb_usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_analyses" ADD CONSTRAINT "ai_analyses_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "tb_processos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
