/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `Acta` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo]` on the table `Actividad` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo]` on the table `FechaProgramada` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo]` on the table `Reuniones` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo]` on the table `Subdocumentos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo]` on the table `Tarea` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo]` on the table `TareaUsuario` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo]` on the table `documentos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo]` on the table `documentosGrupo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[codigo]` on the table `grupo` will be added. If there are existing duplicate values, this will fail.
  - The required column `codigo` was added to the `Acta` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `codigo` was added to the `Actividad` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `codigo` was added to the `FechaProgramada` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `codigo` was added to the `Reuniones` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `codigo` was added to the `Subdocumentos` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `codigo` was added to the `Tarea` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `codigo` was added to the `TareaUsuario` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `codigo` was added to the `documentos` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `codigo` was added to the `documentosGrupo` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `codigo` was added to the `grupo` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "public"."Acta" ADD COLUMN     "aud_fecha_crea" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "aud_fecha_elimina" TIMESTAMP(3),
ADD COLUMN     "aud_fecha_modifica" TIMESTAMP(3),
ADD COLUMN     "aud_usuario_crea" INTEGER,
ADD COLUMN     "aud_usuario_elimina" INTEGER,
ADD COLUMN     "aud_usuario_modifica" INTEGER,
ADD COLUMN     "codigo" TEXT NOT NULL,
ADD COLUMN     "state" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."Actividad" ADD COLUMN     "aud_fecha_crea" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "aud_fecha_elimina" TIMESTAMP(3),
ADD COLUMN     "aud_fecha_modifica" TIMESTAMP(3),
ADD COLUMN     "aud_usuario_crea" INTEGER,
ADD COLUMN     "aud_usuario_elimina" INTEGER,
ADD COLUMN     "aud_usuario_modifica" INTEGER,
ADD COLUMN     "codigo" TEXT NOT NULL,
ADD COLUMN     "state" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."FechaProgramada" ADD COLUMN     "aud_fecha_crea" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "aud_fecha_elimina" TIMESTAMP(3),
ADD COLUMN     "aud_fecha_modifica" TIMESTAMP(3),
ADD COLUMN     "aud_usuario_crea" INTEGER,
ADD COLUMN     "aud_usuario_elimina" INTEGER,
ADD COLUMN     "aud_usuario_modifica" INTEGER,
ADD COLUMN     "codigo" TEXT NOT NULL,
ADD COLUMN     "state" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."Reuniones" ADD COLUMN     "aud_fecha_crea" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "aud_fecha_elimina" TIMESTAMP(3),
ADD COLUMN     "aud_fecha_modifica" TIMESTAMP(3),
ADD COLUMN     "aud_usuario_crea" INTEGER,
ADD COLUMN     "aud_usuario_elimina" INTEGER,
ADD COLUMN     "aud_usuario_modifica" INTEGER,
ADD COLUMN     "codigo" TEXT NOT NULL,
ADD COLUMN     "state" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."Subdocumentos" ADD COLUMN     "aud_fecha_crea" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "aud_fecha_elimina" TIMESTAMP(3),
ADD COLUMN     "aud_fecha_modifica" TIMESTAMP(3),
ADD COLUMN     "aud_usuario_crea" INTEGER,
ADD COLUMN     "aud_usuario_elimina" INTEGER,
ADD COLUMN     "aud_usuario_modifica" INTEGER,
ADD COLUMN     "codigo" TEXT NOT NULL,
ADD COLUMN     "state" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."Tarea" ADD COLUMN     "aud_fecha_crea" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "aud_fecha_elimina" TIMESTAMP(3),
ADD COLUMN     "aud_fecha_modifica" TIMESTAMP(3),
ADD COLUMN     "aud_usuario_crea" INTEGER,
ADD COLUMN     "aud_usuario_elimina" INTEGER,
ADD COLUMN     "aud_usuario_modifica" INTEGER,
ADD COLUMN     "codigo" TEXT NOT NULL,
ADD COLUMN     "state" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."TareaUsuario" ADD COLUMN     "aud_fecha_crea" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "aud_fecha_elimina" TIMESTAMP(3),
ADD COLUMN     "aud_fecha_modifica" TIMESTAMP(3),
ADD COLUMN     "aud_usuario_crea" INTEGER,
ADD COLUMN     "aud_usuario_elimina" INTEGER,
ADD COLUMN     "aud_usuario_modifica" INTEGER,
ADD COLUMN     "codigo" TEXT NOT NULL,
ADD COLUMN     "state" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."documentos" ADD COLUMN     "aud_fecha_crea" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "aud_fecha_elimina" TIMESTAMP(3),
ADD COLUMN     "aud_fecha_modifica" TIMESTAMP(3),
ADD COLUMN     "aud_usuario_crea" INTEGER,
ADD COLUMN     "aud_usuario_elimina" INTEGER,
ADD COLUMN     "aud_usuario_modifica" INTEGER,
ADD COLUMN     "codigo" TEXT NOT NULL,
ADD COLUMN     "state" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."documentosGrupo" ADD COLUMN     "aud_fecha_crea" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "aud_fecha_elimina" TIMESTAMP(3),
ADD COLUMN     "aud_fecha_modifica" TIMESTAMP(3),
ADD COLUMN     "aud_usuario_crea" INTEGER,
ADD COLUMN     "aud_usuario_elimina" INTEGER,
ADD COLUMN     "aud_usuario_modifica" INTEGER,
ADD COLUMN     "codigo" TEXT NOT NULL,
ADD COLUMN     "state" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."grupo" ADD COLUMN     "aud_fecha_crea" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "aud_fecha_elimina" TIMESTAMP(3),
ADD COLUMN     "aud_fecha_modifica" TIMESTAMP(3),
ADD COLUMN     "aud_usuario_crea" INTEGER,
ADD COLUMN     "aud_usuario_elimina" INTEGER,
ADD COLUMN     "aud_usuario_modifica" INTEGER,
ADD COLUMN     "codigo" TEXT NOT NULL,
ADD COLUMN     "state" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Acta_codigo_key" ON "public"."Acta"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Actividad_codigo_key" ON "public"."Actividad"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "FechaProgramada_codigo_key" ON "public"."FechaProgramada"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Reuniones_codigo_key" ON "public"."Reuniones"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Subdocumentos_codigo_key" ON "public"."Subdocumentos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Tarea_codigo_key" ON "public"."Tarea"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "TareaUsuario_codigo_key" ON "public"."TareaUsuario"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "documentos_codigo_key" ON "public"."documentos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "documentosGrupo_codigo_key" ON "public"."documentosGrupo"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "grupo_codigo_key" ON "public"."grupo"("codigo");
