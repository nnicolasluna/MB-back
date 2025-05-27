-- CreateTable
CREATE TABLE "public"."monitoreo_agua" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255),
    "descripcion" TEXT,
    "fecha_contenido" DATE,
    "estado_contenido" VARCHAR(255),
    "bbox" VARCHAR(300),
    "area" DOUBLE PRECISION,
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

    CONSTRAINT "monitoreo_agua_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "monitoreo_agua_codigo_key" ON "public"."monitoreo_agua"("codigo");
