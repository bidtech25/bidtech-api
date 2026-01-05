/*
  Warnings:

  - A unique constraint covering the columns `[supabase_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `supabase_id` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN     "supabase_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_supabase_id_key" ON "users"("supabase_id");
