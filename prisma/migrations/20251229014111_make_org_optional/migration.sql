-- DropForeignKey
ALTER TABLE "processes" DROP CONSTRAINT "processes_organization_id_fkey";

-- AlterTable
ALTER TABLE "processes" ALTER COLUMN "organization_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
