-- Prisma Database Comments Generator v1.1.0

-- archivos comments
COMMENT ON TABLE "archivos" IS 'Tabla de archivos';
COMMENT ON COLUMN "archivos"."id" IS 'Id único del archivo';
COMMENT ON COLUMN "archivos"."nombre" IS 'Nombre del archivo';
COMMENT ON COLUMN "archivos"."tipo_archivo" IS 'MimeType del archivo';
COMMENT ON COLUMN "archivos"."publicUrl" IS 'Ruta del archivo';
COMMENT ON COLUMN "archivos"."tamano_bytes" IS 'Tamaño del archivo en bytes';
