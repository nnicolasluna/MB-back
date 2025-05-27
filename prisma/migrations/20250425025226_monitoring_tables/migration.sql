/*
  Warnings:

  - You are about to drop the column `area` on the `monitoreo_agua` table. All the data in the column will be lost.
  - You are about to drop the column `area` on the `monitoreo_incendios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."monitoreo_agua" DROP COLUMN "area";

-- AlterTable
ALTER TABLE "public"."monitoreo_incendios" DROP COLUMN "area";

-- CreateTable
CREATE TABLE "public"."quemas_historicas" (
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

    CONSTRAINT "quemas_historicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."monitoreo_quemas" (
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

    CONSTRAINT "monitoreo_quemas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."monitoreo_degradacion_suelo" (
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

    CONSTRAINT "monitoreo_degradacion_suelo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."monitoreo_uso_suelo" (
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

    CONSTRAINT "monitoreo_uso_suelo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quemas_historicas_codigo_key" ON "public"."quemas_historicas"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "monitoreo_quemas_codigo_key" ON "public"."monitoreo_quemas"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "monitoreo_degradacion_suelo_codigo_key" ON "public"."monitoreo_degradacion_suelo"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "monitoreo_uso_suelo_codigo_key" ON "public"."monitoreo_uso_suelo"("codigo");

-- AddForeignKey
ALTER TABLE "public"."quemas_historicas" ADD CONSTRAINT "quemas_historicas_aud_usuario_crea_fkey" FOREIGN KEY ("aud_usuario_crea") REFERENCES "public"."usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."monitoreo_quemas" ADD CONSTRAINT "monitoreo_quemas_aud_usuario_crea_fkey" FOREIGN KEY ("aud_usuario_crea") REFERENCES "public"."usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."monitoreo_degradacion_suelo" ADD CONSTRAINT "monitoreo_degradacion_suelo_aud_usuario_crea_fkey" FOREIGN KEY ("aud_usuario_crea") REFERENCES "public"."usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."monitoreo_uso_suelo" ADD CONSTRAINT "monitoreo_uso_suelo_aud_usuario_crea_fkey" FOREIGN KEY ("aud_usuario_crea") REFERENCES "public"."usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
