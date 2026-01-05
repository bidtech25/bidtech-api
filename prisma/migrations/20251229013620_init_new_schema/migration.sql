/*
  Warnings:

  - You are about to drop the `ai_analyses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tb_processos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tb_usuarios` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ai_analyses" DROP CONSTRAINT "ai_analyses_process_id_fkey";

-- DropForeignKey
ALTER TABLE "tb_processos" DROP CONSTRAINT "tb_processos_user_id_fkey";

-- DropTable
DROP TABLE "ai_analyses";

-- DropTable
DROP TABLE "tb_processos";

-- DropTable
DROP TABLE "tb_usuarios";

-- CreateTable
CREATE TABLE "processes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "process_owner" TEXT,
    "process_owner_id" UUID,
    "sector_id" UUID,
    "role_id" UUID,
    "organization_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "objective" TEXT,
    "problem_solved" TEXT,
    "expected_result" TEXT,
    "success_metric" TEXT,
    "failure_impact" TEXT,
    "scope_start" TEXT,
    "scope_end" TEXT,
    "in_scope" TEXT[],
    "out_of_scope" TEXT[],
    "involved_areas" TEXT[],
    "involved_people" TEXT[],
    "process_description" TEXT,
    "average_time" TEXT,
    "business_rules" TEXT[],
    "bpmn_code" TEXT,
    "flowchart_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "processes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_steps" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "process_id" UUID NOT NULL,
    "step_number" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "responsible_role" TEXT,
    "estimated_time" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "process_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_files" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "process_id" UUID NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_type" TEXT,
    "description" TEXT,
    "uploaded_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "process_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_inputs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "process_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "source" TEXT,

    CONSTRAINT "process_inputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_outputs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "process_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "destination" TEXT,

    CONSTRAINT "process_outputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_insights" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "process_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "result" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'processing',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sectors" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "sectors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "processes_status_idx" ON "processes"("status");

-- CreateIndex
CREATE INDEX "processes_sector_id_idx" ON "processes"("sector_id");

-- CreateIndex
CREATE INDEX "processes_organization_id_idx" ON "processes"("organization_id");

-- CreateIndex
CREATE INDEX "processes_user_id_idx" ON "processes"("user_id");

-- CreateIndex
CREATE INDEX "process_steps_process_id_idx" ON "process_steps"("process_id");

-- CreateIndex
CREATE INDEX "process_files_process_id_idx" ON "process_files"("process_id");

-- CreateIndex
CREATE INDEX "process_inputs_process_id_idx" ON "process_inputs"("process_id");

-- CreateIndex
CREATE INDEX "process_outputs_process_id_idx" ON "process_outputs"("process_id");

-- CreateIndex
CREATE INDEX "ai_insights_process_id_idx" ON "ai_insights"("process_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sectors_name_key" ON "sectors"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sectors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_steps" ADD CONSTRAINT "process_steps_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_files" ADD CONSTRAINT "process_files_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_inputs" ADD CONSTRAINT "process_inputs_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_outputs" ADD CONSTRAINT "process_outputs_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_insights" ADD CONSTRAINT "ai_insights_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
