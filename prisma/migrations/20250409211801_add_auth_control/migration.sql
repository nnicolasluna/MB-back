-- AlterEnum
ALTER TYPE "public"."UserStatus" ADD VALUE 'BANNED';

-- AlterTable
ALTER TABLE "public"."usuario" ADD COLUMN     "bloqueado_hasta" DATE,
ADD COLUMN     "tfa_activo" BOOLEAN NOT NULL DEFAULT false;
