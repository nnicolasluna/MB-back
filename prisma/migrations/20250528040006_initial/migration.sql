-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'APROVE', 'INACTIVE', 'DELETED', 'PENDING', 'REJECT', 'DISABLED', 'BANNED');

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
    "bloqueado_hasta" DATE,
    "tfa_activo" BOOLEAN NOT NULL DEFAULT false,
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

-- CreateIndex
CREATE UNIQUE INDEX "archivos_codigo_key" ON "public"."archivos"("codigo");

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
