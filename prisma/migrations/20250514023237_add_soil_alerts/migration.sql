/*
  Warnings:

  - You are about to drop the `quemas_historicas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."quemas_historicas" DROP CONSTRAINT "quemas_historicas_aud_usuario_crea_fkey";

-- DropTable
DROP TABLE "public"."quemas_historicas";

-- CreateTable
CREATE TABLE "public"."alertas_suelo" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255),
    "descripcion" TEXT,
    "fecha_contenido" DATE,
    "estado_contenido" VARCHAR(255),
    "bbox" VARCHAR(300),
    "capa" VARCHAR(300),
    "nombre_estilo" VARCHAR(255),
    "aud_usuario_crea" INTEGER,
    "aud_fecha_crea" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "aud_usuario_modifica" INTEGER,
    "aud_fecha_modifica" TIMESTAMP(3),
    "aud_usuario_elimina" INTEGER,
    "aud_fecha_elimina" TIMESTAMP(3),
    "state" BOOLEAN NOT NULL DEFAULT true,
    "codigo" TEXT NOT NULL,

    CONSTRAINT "alertas_suelo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "alertas_suelo_codigo_key" ON "public"."alertas_suelo"("codigo");

-- AddForeignKey
ALTER TABLE "public"."alertas_suelo" ADD CONSTRAINT "alertas_suelo_aud_usuario_crea_fkey" FOREIGN KEY ("aud_usuario_crea") REFERENCES "public"."usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
