-- CreateTable
CREATE TABLE "public"."sitios_arqueologicos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "cobertura" VARCHAR(255) NOT NULL,
    "estilo" VARCHAR(255) NOT NULL,

    CONSTRAINT "sitios_arqueologicos_pkey" PRIMARY KEY ("id")
);
