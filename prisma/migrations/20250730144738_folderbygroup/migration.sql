/*
  Warnings:

  - You are about to drop the column `grupoId` on the `documentosGrupo` table. All the data in the column will be lost.
  - Added the required column `FolderbyGrupoId` to the `documentosGrupo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."documentosGrupo" DROP CONSTRAINT "documentosGrupo_grupoId_fkey";

-- AlterTable
ALTER TABLE "public"."documentosGrupo" DROP COLUMN "grupoId",
ADD COLUMN     "FolderbyGrupoId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."FolderByGrupo" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "descripcion" VARCHAR(200),
    "grupoId" INTEGER NOT NULL,
    "aud_usuario_crea" INTEGER,
    "aud_fecha_crea" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "aud_usuario_modifica" INTEGER,
    "aud_fecha_modifica" TIMESTAMP(3),
    "aud_usuario_elimina" INTEGER,
    "aud_fecha_elimina" TIMESTAMP(3),
    "state" BOOLEAN NOT NULL DEFAULT true,
    "codigo" TEXT NOT NULL,

    CONSTRAINT "FolderByGrupo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FolderByGrupo_codigo_key" ON "public"."FolderByGrupo"("codigo");

-- AddForeignKey
ALTER TABLE "public"."documentosGrupo" ADD CONSTRAINT "documentosGrupo_FolderbyGrupoId_fkey" FOREIGN KEY ("FolderbyGrupoId") REFERENCES "public"."FolderByGrupo"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."FolderByGrupo" ADD CONSTRAINT "FolderByGrupo_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "public"."grupo"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
