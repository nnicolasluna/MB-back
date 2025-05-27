-- Prisma Database Comments Generator v1.1.0

-- recursos_cartograficos comments
COMMENT ON TABLE "recursos_cartograficos" IS 'Tabla de recurosos cartográficos';
COMMENT ON COLUMN "recursos_cartograficos"."id" IS 'Id único del mapa';
COMMENT ON COLUMN "recursos_cartograficos"."nombre" IS 'Nombre del mapa';
COMMENT ON COLUMN "recursos_cartograficos"."tipo_geom" IS 'Tipo de mapa (Punto, Línea, Polígono)';
COMMENT ON COLUMN "recursos_cartograficos"."descripcion" IS 'Descripción del mapa';
COMMENT ON COLUMN "recursos_cartograficos"."frecuencia_actualizacion" IS 'Frecuencia de actualización del mapa';
COMMENT ON COLUMN "recursos_cartograficos"."fecha_contenido" IS 'Fecha de contenido';
COMMENT ON COLUMN "recursos_cartograficos"."permitir_descarga" IS 'Permitir descarga';
COMMENT ON COLUMN "recursos_cartograficos"."es_publico" IS 'Es visible en el geovisor público';
COMMENT ON COLUMN "recursos_cartograficos"."bbox" IS 'Boundingbox del mapa';
COMMENT ON COLUMN "recursos_cartograficos"."capa" IS 'Nombre de la tabla del mapa en el schema cartographic';
COMMENT ON COLUMN "recursos_cartograficos"."estilo" IS 'Id del estilo asociado al mapa';

-- estilos_mapas comments
COMMENT ON TABLE "estilos_mapas" IS 'Tabla de estilos';
COMMENT ON COLUMN "estilos_mapas"."id" IS 'Id único del estilo';
COMMENT ON COLUMN "estilos_mapas"."nombre" IS 'Nombre del estilo';
COMMENT ON COLUMN "estilos_mapas"."tipo" IS 'Tipo del estilo (SLD)';

-- log_actividad comments
COMMENT ON TABLE "log_actividad" IS 'Tabla de actividades';
COMMENT ON COLUMN "log_actividad"."id" IS 'Id único de actividad';
COMMENT ON COLUMN "log_actividad"."descripcion" IS 'Descripción de la actividad';
COMMENT ON COLUMN "log_actividad"."metodo" IS 'Método HTTP  que se utilizó';
COMMENT ON COLUMN "log_actividad"."url" IS 'Url del recurso en el que se realizo la actividad';
COMMENT ON COLUMN "log_actividad"."direccion_ip" IS 'Ip del que realizo la actividad';
COMMENT ON COLUMN "log_actividad"."id_usuario" IS 'Id del usuario que realizó la actividad';
COMMENT ON COLUMN "log_actividad"."fecha_accion" IS 'Fecha de la actividad';

-- roles comments
COMMENT ON TABLE "roles" IS 'Tabla roles';
COMMENT ON COLUMN "roles"."id" IS 'Id único del rol';
COMMENT ON COLUMN "roles"."nombre_rol" IS 'Nombre del rol';
COMMENT ON COLUMN "roles"."descripcion_rol" IS 'Descripción del rol';

-- recursos comments
COMMENT ON TABLE "recursos" IS 'Tabla módulos del sistema';
COMMENT ON COLUMN "recursos"."id" IS 'Id único del módulo';
COMMENT ON COLUMN "recursos"."nombre_recurso" IS 'Nombre del módulo';
COMMENT ON COLUMN "recursos"."codigo_recurso" IS 'Código del módulo';
COMMENT ON COLUMN "recursos"."tipo_recurso" IS 'Tipo de módulo';

-- recurso_roles comments
COMMENT ON TABLE "recurso_roles" IS 'Tabla Roles - Módulos';
COMMENT ON COLUMN "recurso_roles"."id_role" IS 'Id del rol';
COMMENT ON COLUMN "recurso_roles"."id_recurso" IS 'Id del módulo';
COMMENT ON COLUMN "recurso_roles"."permiso" IS 'Permiso codificado';
