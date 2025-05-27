-- CreateTable
CREATE TABLE "public"."focos_calor" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "detalles" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL,
    "tabla_datos" TEXT,

    CONSTRAINT "focos_calor_pkey" PRIMARY KEY ("id")
);
