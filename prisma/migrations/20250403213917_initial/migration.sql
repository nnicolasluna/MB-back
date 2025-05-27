-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- INFO: Must be the same name on the .env
CREATE SCHEMA IF NOT EXISTS cartographic;

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'APROVE', 'INACTIVE', 'DELETED', 'PENDING', 'REJECT', 'DISABLED');

-- CreateTable
CREATE TABLE "public"."archivos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(500) NOT NULL,
    "tipo_archivo" VARCHAR(250) NOT NULL,
    "publicUrl" TEXT,
    "tamano_bytes" INTEGER NOT NULL,
    "aud_usuario_crea" INTEGER,
    "aud_fecha_crea" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "aud_usuario_modifica" INTEGER,
    "aud_fecha_modifica" TIMESTAMP(3),
    "aud_usuario_elimina" INTEGER,
    "aud_fecha_elimina" TIMESTAMP(3),
    "state" BOOLEAN NOT NULL DEFAULT true,
    "codigo" TEXT NOT NULL,

    CONSTRAINT "archivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."servicios_mapas_web" (
    "id" SERIAL NOT NULL,
    "url" TEXT,
    "layer" VARCHAR(250),
    "etiqueta" VARCHAR(250),
    "grupo" VARCHAR(200),
    "descripcion" TEXT,
    "opacidad" DOUBLE PRECISION,
    "format" VARCHAR(200),
    "aud_usuario_crea" INTEGER,
    "aud_fecha_crea" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "aud_usuario_modifica" INTEGER,
    "aud_fecha_modifica" TIMESTAMP(3),
    "aud_usuario_elimina" INTEGER,
    "aud_fecha_elimina" TIMESTAMP(3),
    "state" BOOLEAN NOT NULL DEFAULT true,
    "codigo" TEXT NOT NULL,

    CONSTRAINT "servicios_mapas_web_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recursos_cartograficos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(200),
    "tipo_geom" VARCHAR(500),
    "fuente" VARCHAR(300),
    "descripcion" TEXT,
    "contacto_recurso" VARCHAR(600),
    "estado_recurso" VARCHAR(300),
    "frecuencia_actualizacion" VARCHAR(300),
    "crs" VARCHAR(250),
    "escala" VARCHAR(200),
    "fecha_contenido" DATE,
    "permitir_descarga" BOOLEAN,
    "es_publico" BOOLEAN,
    "bbox" VARCHAR(300),
    "capa" VARCHAR(300),
    "estilo" INTEGER,
    "permitir_descarga_carimbo" BOOLEAN,
    "carimbo" INTEGER,
    "aud_usuario_crea" INTEGER,
    "aud_fecha_crea" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "aud_usuario_modifica" INTEGER,
    "aud_fecha_modifica" TIMESTAMP(3),
    "aud_usuario_elimina" INTEGER,
    "aud_fecha_elimina" TIMESTAMP(3),
    "state" BOOLEAN NOT NULL DEFAULT true,
    "codigo" TEXT NOT NULL,

    CONSTRAINT "recursos_cartograficos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."estilos_mapas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(300),
    "tipo" VARCHAR(100),
    "aud_usuario_crea" INTEGER,
    "aud_fecha_crea" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "aud_usuario_modifica" INTEGER,
    "aud_fecha_modifica" TIMESTAMP(3),
    "aud_usuario_elimina" INTEGER,
    "aud_fecha_elimina" TIMESTAMP(3),
    "state" BOOLEAN NOT NULL DEFAULT true,
    "codigo" TEXT NOT NULL,

    CONSTRAINT "estilos_mapas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tematicas_mapas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(300),
    "descripcion" TEXT,
    "aud_usuario_crea" INTEGER,
    "aud_fecha_crea" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "aud_usuario_modifica" INTEGER,
    "aud_fecha_modifica" TIMESTAMP(3),
    "aud_usuario_elimina" INTEGER,
    "aud_fecha_elimina" TIMESTAMP(3),
    "state" BOOLEAN NOT NULL DEFAULT true,
    "codigo" TEXT NOT NULL,

    CONSTRAINT "tematicas_mapas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."log_actividad" (
    "id" SERIAL NOT NULL,
    "descripcion" VARCHAR(100),
    "metodo" VARCHAR(100),
    "url" VARCHAR(100),
    "direccion_ip" VARCHAR(100),
    "id_usuario" INTEGER,
    "fecha_accion" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."roles" (
    "id" SERIAL NOT NULL,
    "nombre_rol" VARCHAR(100) NOT NULL,
    "descripcion_rol" VARCHAR(250),
    "aud_usuario_crea" INTEGER,
    "aud_fecha_crea" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "aud_usuario_modifica" INTEGER,
    "aud_fecha_modifica" TIMESTAMP(3),
    "aud_usuario_elimina" INTEGER,
    "aud_fecha_elimina" TIMESTAMP(3),
    "state" BOOLEAN NOT NULL DEFAULT true,
    "codigo" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recursos" (
    "id" SERIAL NOT NULL,
    "nombre_recurso" VARCHAR(200) NOT NULL,
    "codigo_recurso" VARCHAR(50) NOT NULL,
    "tipo_recurso" VARCHAR(30) NOT NULL,

    CONSTRAINT "recursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recurso_roles" (
    "id_role" INTEGER NOT NULL,
    "id_recurso" INTEGER NOT NULL,
    "permiso" INTEGER NOT NULL DEFAULT 0,
    "aud_usuario_crea" INTEGER,
    "aud_fecha_crea" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "aud_usuario_modifica" INTEGER,
    "aud_fecha_modifica" TIMESTAMP(3),
    "aud_usuario_elimina" INTEGER,
    "aud_fecha_elimina" TIMESTAMP(3),
    "state" BOOLEAN NOT NULL DEFAULT true,
    "codigo" TEXT NOT NULL,

    CONSTRAINT "recurso_roles_pkey" PRIMARY KEY ("id_role","id_recurso")
);

-- CreateTable
CREATE TABLE "public"."usuario" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido_paterno" VARCHAR(50) NOT NULL,
    "apellido_materno" VARCHAR(50) NOT NULL,
    "ci" VARCHAR(50) NOT NULL,
    "direccion" TEXT NOT NULL,
    "nombre_usuario" VARCHAR(50) NOT NULL,
    "correo" VARCHAR(50) NOT NULL,
    "telefono" VARCHAR(50),
    "expiracion_cuenta" DATE,
    "contraseña" VARCHAR(200),
    "codigo_verificacion" VARCHAR(255),
    "expiracion_codigo_verificacion" TIMESTAMP(3),
    "codigo_verificacion_revisado" BOOLEAN DEFAULT false,
    "estado_usuario" "public"."UserStatus" NOT NULL DEFAULT 'PENDING',
    "id_imagen" INTEGER,
    "id_rol" INTEGER NOT NULL,
    "aud_usuario_crea" INTEGER,
    "aud_fecha_crea" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "aud_usuario_modifica" INTEGER,
    "aud_fecha_modifica" TIMESTAMP(3),
    "aud_usuario_elimina" INTEGER,
    "aud_fecha_elimina" TIMESTAMP(3),
    "state" BOOLEAN NOT NULL DEFAULT true,
    "codigo" TEXT NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_ThematicMapData" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ThematicMapData_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "archivos_codigo_key" ON "public"."archivos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "servicios_mapas_web_codigo_key" ON "public"."servicios_mapas_web"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "recursos_cartograficos_codigo_key" ON "public"."recursos_cartograficos"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "estilos_mapas_codigo_key" ON "public"."estilos_mapas"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "tematicas_mapas_codigo_key" ON "public"."tematicas_mapas"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "roles_codigo_key" ON "public"."roles"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "nombre_rol" ON "public"."roles"("nombre_rol");

-- CreateIndex
CREATE UNIQUE INDEX "recursos_codigo_recurso_key" ON "public"."recursos"("codigo_recurso");

-- CreateIndex
CREATE UNIQUE INDEX "recurso_roles_codigo_key" ON "public"."recurso_roles"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_codigo_key" ON "public"."usuario"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "nombre_usuario_correo" ON "public"."usuario"("nombre_usuario", "correo");

-- CreateIndex
CREATE INDEX "_ThematicMapData_B_index" ON "public"."_ThematicMapData"("B");

-- AddForeignKey
ALTER TABLE "public"."recursos_cartograficos" ADD CONSTRAINT "recursos_cartograficos_estilo_fkey" FOREIGN KEY ("estilo") REFERENCES "public"."estilos_mapas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recursos_cartograficos" ADD CONSTRAINT "recursos_cartograficos_carimbo_fkey" FOREIGN KEY ("carimbo") REFERENCES "public"."archivos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."log_actividad" ADD CONSTRAINT "log_actividad_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recurso_roles" ADD CONSTRAINT "recurso_roles_id_recurso_fkey" FOREIGN KEY ("id_recurso") REFERENCES "public"."recursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recurso_roles" ADD CONSTRAINT "recurso_roles_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "public"."roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usuario" ADD CONSTRAINT "usuario_id_imagen_fkey" FOREIGN KEY ("id_imagen") REFERENCES "public"."archivos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usuario" ADD CONSTRAINT "usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "public"."roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ThematicMapData" ADD CONSTRAINT "_ThematicMapData_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."recursos_cartograficos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ThematicMapData" ADD CONSTRAINT "_ThematicMapData_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."tematicas_mapas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
