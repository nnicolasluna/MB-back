-- CreateTable
CREATE TABLE "public"."documentosGrupo" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "descripcion" VARCHAR(200),
    "nombreArchivo" VARCHAR(200),
    "grupoId" INTEGER NOT NULL,
    "fecha_crea" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "fecha_modifica" TIMESTAMP(3),
    "fecha_elimina" TIMESTAMP(3),

    CONSTRAINT "documentosGrupo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."documentosGrupo" ADD CONSTRAINT "documentosGrupo_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "public"."grupo"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
