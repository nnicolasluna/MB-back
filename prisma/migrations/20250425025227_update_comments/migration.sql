-- Prisma Database Comments Generator v1.1.0

-- archivos comments
COMMENT ON TABLE "archivos" IS 'Tabla de archivos';
COMMENT ON COLUMN "archivos"."id" IS 'Id único del archivo';
COMMENT ON COLUMN "archivos"."nombre" IS 'Nombre del archivo';
COMMENT ON COLUMN "archivos"."tipo_archivo" IS 'MimeType del archivo';
COMMENT ON COLUMN "archivos"."publicUrl" IS 'Ruta del archivo';
COMMENT ON COLUMN "archivos"."tamano_bytes" IS 'Tamaño del archivo en bytes';
COMMENT ON COLUMN "archivos"."aud_usuario_crea" IS 'Id del usuario que creo el registro';
COMMENT ON COLUMN "archivos"."aud_fecha_crea" IS 'Fecha de creación del registro';
COMMENT ON COLUMN "archivos"."aud_usuario_modifica" IS 'Id del usuario que actualizó el registro';
COMMENT ON COLUMN "archivos"."aud_fecha_modifica" IS 'Fecha de actualización del registro';
COMMENT ON COLUMN "archivos"."aud_usuario_elimina" IS 'Id del usuario que eliminó el registro';
COMMENT ON COLUMN "archivos"."aud_fecha_elimina" IS 'Fecha de eliminación del registro';
COMMENT ON COLUMN "archivos"."state" IS 'Estado del registro true = eliminado';
COMMENT ON COLUMN "archivos"."codigo" IS 'Código único del registro';

-- focos_calor comments
COMMENT ON TABLE "focos_calor" IS 'Tabla de puntos de calor';
COMMENT ON COLUMN "focos_calor"."id" IS 'Id único del registro';
COMMENT ON COLUMN "focos_calor"."url" IS 'Url del shape descargado';
COMMENT ON COLUMN "focos_calor"."detalles" IS 'Detalles';
COMMENT ON COLUMN "focos_calor"."fecha" IS 'Fecha de registro';
COMMENT ON COLUMN "focos_calor"."estado" IS 'Estado';
COMMENT ON COLUMN "focos_calor"."tabla_datos" IS 'Tabla de datos';

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
COMMENT ON COLUMN "recursos_cartograficos"."aud_usuario_crea" IS 'Id del usuario que creo el registro';
COMMENT ON COLUMN "recursos_cartograficos"."aud_fecha_crea" IS 'Fecha de creación del registro';
COMMENT ON COLUMN "recursos_cartograficos"."aud_usuario_modifica" IS 'Id del usuario que actualizó el registro';
COMMENT ON COLUMN "recursos_cartograficos"."aud_fecha_modifica" IS 'Fecha de actualización del registro';
COMMENT ON COLUMN "recursos_cartograficos"."aud_usuario_elimina" IS 'Id del usuario que eliminó el registro';
COMMENT ON COLUMN "recursos_cartograficos"."aud_fecha_elimina" IS 'Fecha de eliminación del registro';
COMMENT ON COLUMN "recursos_cartograficos"."state" IS 'Estado del registro true = eliminado';
COMMENT ON COLUMN "recursos_cartograficos"."codigo" IS 'Código único del registro';

-- estilos_mapas comments
COMMENT ON TABLE "estilos_mapas" IS 'Tabla de estilos';
COMMENT ON COLUMN "estilos_mapas"."id" IS 'Id único del estilo';
COMMENT ON COLUMN "estilos_mapas"."nombre" IS 'Nombre del estilo';
COMMENT ON COLUMN "estilos_mapas"."tipo" IS 'Tipo del estilo (SLD)';
COMMENT ON COLUMN "estilos_mapas"."aud_usuario_crea" IS 'Id del usuario que creo el registro';
COMMENT ON COLUMN "estilos_mapas"."aud_fecha_crea" IS 'Fecha de creación del registro';
COMMENT ON COLUMN "estilos_mapas"."aud_usuario_modifica" IS 'Id del usuario que actualizó el registro';
COMMENT ON COLUMN "estilos_mapas"."aud_fecha_modifica" IS 'Fecha de actualización del registro';
COMMENT ON COLUMN "estilos_mapas"."aud_usuario_elimina" IS 'Id del usuario que eliminó el registro';
COMMENT ON COLUMN "estilos_mapas"."aud_fecha_elimina" IS 'Fecha de eliminación del registro';
COMMENT ON COLUMN "estilos_mapas"."state" IS 'Estado del registro true = eliminado';
COMMENT ON COLUMN "estilos_mapas"."codigo" IS 'Código único del registro';

-- quemas_historicas comments
COMMENT ON TABLE "quemas_historicas" IS 'Tabla de quemas historicas';
COMMENT ON COLUMN "quemas_historicas"."id" IS 'Id único del registro';
COMMENT ON COLUMN "quemas_historicas"."nombre" IS 'Nombre';
COMMENT ON COLUMN "quemas_historicas"."descripcion" IS 'Descripción';
COMMENT ON COLUMN "quemas_historicas"."fecha_contenido" IS 'Fecha de del mapa';
COMMENT ON COLUMN "quemas_historicas"."estado_contenido" IS 'Estado Activo/Inactivo';
COMMENT ON COLUMN "quemas_historicas"."bbox" IS 'Boundingbox del mapa';
COMMENT ON COLUMN "quemas_historicas"."capa" IS 'Nombre de la tabla del mapa en el schema cartographic';
COMMENT ON COLUMN "quemas_historicas"."nombre_estilo" IS 'Nombre del estilo asociado al mapa';
COMMENT ON COLUMN "quemas_historicas"."aud_usuario_crea" IS 'Id del usuario que creo el registro';
COMMENT ON COLUMN "quemas_historicas"."aud_fecha_crea" IS 'Fecha de creación del registro';
COMMENT ON COLUMN "quemas_historicas"."aud_usuario_modifica" IS 'Id del usuario que actualizó el registro';
COMMENT ON COLUMN "quemas_historicas"."aud_fecha_modifica" IS 'Fecha de actualización del registro';
COMMENT ON COLUMN "quemas_historicas"."aud_usuario_elimina" IS 'Id del usuario que eliminó el registro';
COMMENT ON COLUMN "quemas_historicas"."aud_fecha_elimina" IS 'Fecha de eliminación del registro';
COMMENT ON COLUMN "quemas_historicas"."state" IS 'Estado del registro true = eliminado';
COMMENT ON COLUMN "quemas_historicas"."codigo" IS 'Código único del registro';

-- monitoreo_quemas comments
COMMENT ON TABLE "monitoreo_quemas" IS 'Tabla de monitoreo quemas';
COMMENT ON COLUMN "monitoreo_quemas"."id" IS 'Id único del registro';
COMMENT ON COLUMN "monitoreo_quemas"."nombre" IS 'Nombre del monitoreo';
COMMENT ON COLUMN "monitoreo_quemas"."descripcion" IS 'Descripción del monitoreo';
COMMENT ON COLUMN "monitoreo_quemas"."fecha_contenido" IS 'Fecha de del mapa';
COMMENT ON COLUMN "monitoreo_quemas"."estado_contenido" IS 'Estado Activo/Inactivo';
COMMENT ON COLUMN "monitoreo_quemas"."bbox" IS 'Boundingbox del mapa';
COMMENT ON COLUMN "monitoreo_quemas"."capa" IS 'Nombre de la tabla del mapa en el schema cartographic';
COMMENT ON COLUMN "monitoreo_quemas"."nombre_estilo" IS 'Nombre del estilo asociado al mapa';
COMMENT ON COLUMN "monitoreo_quemas"."aud_usuario_crea" IS 'Id del usuario que creo el registro';
COMMENT ON COLUMN "monitoreo_quemas"."aud_fecha_crea" IS 'Fecha de creación del registro';
COMMENT ON COLUMN "monitoreo_quemas"."aud_usuario_modifica" IS 'Id del usuario que actualizó el registro';
COMMENT ON COLUMN "monitoreo_quemas"."aud_fecha_modifica" IS 'Fecha de actualización del registro';
COMMENT ON COLUMN "monitoreo_quemas"."aud_usuario_elimina" IS 'Id del usuario que eliminó el registro';
COMMENT ON COLUMN "monitoreo_quemas"."aud_fecha_elimina" IS 'Fecha de eliminación del registro';
COMMENT ON COLUMN "monitoreo_quemas"."state" IS 'Estado del registro true = eliminado';
COMMENT ON COLUMN "monitoreo_quemas"."codigo" IS 'Código único del registro';

-- monitoreo_incendios comments
COMMENT ON TABLE "monitoreo_incendios" IS 'Tabla de monitoreo de incendios';
COMMENT ON COLUMN "monitoreo_incendios"."id" IS 'Id único del registro';
COMMENT ON COLUMN "monitoreo_incendios"."nombre" IS 'Nombre del monitoreo';
COMMENT ON COLUMN "monitoreo_incendios"."descripcion" IS 'Descripción del monitoreo';
COMMENT ON COLUMN "monitoreo_incendios"."fecha_contenido" IS 'Fecha de del mapa';
COMMENT ON COLUMN "monitoreo_incendios"."estado_contenido" IS 'Estado Activo/Inactivo';
COMMENT ON COLUMN "monitoreo_incendios"."bbox" IS 'Boundingbox del mapa';
COMMENT ON COLUMN "monitoreo_incendios"."capa" IS 'Nombre de la tabla del mapa en el schema cartographic';
COMMENT ON COLUMN "monitoreo_incendios"."nombre_estilo" IS 'Nombre del estilo asociado al mapa';
COMMENT ON COLUMN "monitoreo_incendios"."aud_usuario_crea" IS 'Id del usuario que creo el registro';
COMMENT ON COLUMN "monitoreo_incendios"."aud_fecha_crea" IS 'Fecha de creación del registro';
COMMENT ON COLUMN "monitoreo_incendios"."aud_usuario_modifica" IS 'Id del usuario que actualizó el registro';
COMMENT ON COLUMN "monitoreo_incendios"."aud_fecha_modifica" IS 'Fecha de actualización del registro';
COMMENT ON COLUMN "monitoreo_incendios"."aud_usuario_elimina" IS 'Id del usuario que eliminó el registro';
COMMENT ON COLUMN "monitoreo_incendios"."aud_fecha_elimina" IS 'Fecha de eliminación del registro';
COMMENT ON COLUMN "monitoreo_incendios"."state" IS 'Estado del registro true = eliminado';
COMMENT ON COLUMN "monitoreo_incendios"."codigo" IS 'Código único del registro';

-- monitoreo_degradacion_suelo comments
COMMENT ON TABLE "monitoreo_degradacion_suelo" IS 'Tabla de monitoreo de degradación de suelo';
COMMENT ON COLUMN "monitoreo_degradacion_suelo"."id" IS 'Id único del registro';
COMMENT ON COLUMN "monitoreo_degradacion_suelo"."nombre" IS 'Nombre del monitoreo';
COMMENT ON COLUMN "monitoreo_degradacion_suelo"."descripcion" IS 'Descripción del monitoreo';
COMMENT ON COLUMN "monitoreo_degradacion_suelo"."fecha_contenido" IS 'Fecha de del mapa';
COMMENT ON COLUMN "monitoreo_degradacion_suelo"."estado_contenido" IS 'Estado Activo/Inactivo';
COMMENT ON COLUMN "monitoreo_degradacion_suelo"."bbox" IS 'Boundingbox del mapa';
COMMENT ON COLUMN "monitoreo_degradacion_suelo"."capa" IS 'Nombre de la tabla del mapa en el schema cartographic';
COMMENT ON COLUMN "monitoreo_degradacion_suelo"."nombre_estilo" IS 'Nombre del estilo asociado al mapa';
COMMENT ON COLUMN "monitoreo_degradacion_suelo"."aud_usuario_crea" IS 'Id del usuario que creo el registro';
COMMENT ON COLUMN "monitoreo_degradacion_suelo"."aud_fecha_crea" IS 'Fecha de creación del registro';
COMMENT ON COLUMN "monitoreo_degradacion_suelo"."aud_usuario_modifica" IS 'Id del usuario que actualizó el registro';
COMMENT ON COLUMN "monitoreo_degradacion_suelo"."aud_fecha_modifica" IS 'Fecha de actualización del registro';
COMMENT ON COLUMN "monitoreo_degradacion_suelo"."aud_usuario_elimina" IS 'Id del usuario que eliminó el registro';
COMMENT ON COLUMN "monitoreo_degradacion_suelo"."aud_fecha_elimina" IS 'Fecha de eliminación del registro';
COMMENT ON COLUMN "monitoreo_degradacion_suelo"."state" IS 'Estado del registro true = eliminado';
COMMENT ON COLUMN "monitoreo_degradacion_suelo"."codigo" IS 'Código único del registro';

-- monitoreo_uso_suelo comments
COMMENT ON TABLE "monitoreo_uso_suelo" IS 'Tabla de monitoreo de uso de suelo';
COMMENT ON COLUMN "monitoreo_uso_suelo"."id" IS 'Id único del registro';
COMMENT ON COLUMN "monitoreo_uso_suelo"."nombre" IS 'Nombre';
COMMENT ON COLUMN "monitoreo_uso_suelo"."descripcion" IS 'Descripción';
COMMENT ON COLUMN "monitoreo_uso_suelo"."fecha_contenido" IS 'Fecha de del mapa';
COMMENT ON COLUMN "monitoreo_uso_suelo"."estado_contenido" IS 'Estado Activo/Inactivo';
COMMENT ON COLUMN "monitoreo_uso_suelo"."bbox" IS 'Boundingbox del mapa';
COMMENT ON COLUMN "monitoreo_uso_suelo"."capa" IS 'Nombre de la tabla del mapa en el schema cartographic';
COMMENT ON COLUMN "monitoreo_uso_suelo"."nombre_estilo" IS 'Nombre del estilo asociado al mapa';
COMMENT ON COLUMN "monitoreo_uso_suelo"."aud_usuario_crea" IS 'Id del usuario que creo el registro';
COMMENT ON COLUMN "monitoreo_uso_suelo"."aud_fecha_crea" IS 'Fecha de creación del registro';
COMMENT ON COLUMN "monitoreo_uso_suelo"."aud_usuario_modifica" IS 'Id del usuario que actualizó el registro';
COMMENT ON COLUMN "monitoreo_uso_suelo"."aud_fecha_modifica" IS 'Fecha de actualización del registro';
COMMENT ON COLUMN "monitoreo_uso_suelo"."aud_usuario_elimina" IS 'Id del usuario que eliminó el registro';
COMMENT ON COLUMN "monitoreo_uso_suelo"."aud_fecha_elimina" IS 'Fecha de eliminación del registro';
COMMENT ON COLUMN "monitoreo_uso_suelo"."state" IS 'Estado del registro true = eliminado';
COMMENT ON COLUMN "monitoreo_uso_suelo"."codigo" IS 'Código único del registro';

-- monitoreo_agua comments
COMMENT ON TABLE "monitoreo_agua" IS 'Tabla de monitoreo de cuerpos de agua';
COMMENT ON COLUMN "monitoreo_agua"."id" IS 'Id único del registro';
COMMENT ON COLUMN "monitoreo_agua"."nombre" IS 'Nombre del monitoreo';
COMMENT ON COLUMN "monitoreo_agua"."descripcion" IS 'Descripción del monitoreo';
COMMENT ON COLUMN "monitoreo_agua"."fecha_contenido" IS 'Fecha de del mapa';
COMMENT ON COLUMN "monitoreo_agua"."estado_contenido" IS 'Estado Activo/Inactivo';
COMMENT ON COLUMN "monitoreo_agua"."bbox" IS 'Boundingbox del mapa';
COMMENT ON COLUMN "monitoreo_agua"."capa" IS 'Nombre de la tabla del mapa en el schema cartographic';
COMMENT ON COLUMN "monitoreo_agua"."nombre_estilo" IS 'Nombre del estilo asociado al mapa';
COMMENT ON COLUMN "monitoreo_agua"."aud_usuario_crea" IS 'Id del usuario que creo el registro';
COMMENT ON COLUMN "monitoreo_agua"."aud_fecha_crea" IS 'Fecha de creación del registro';
COMMENT ON COLUMN "monitoreo_agua"."aud_usuario_modifica" IS 'Id del usuario que actualizó el registro';
COMMENT ON COLUMN "monitoreo_agua"."aud_fecha_modifica" IS 'Fecha de actualización del registro';
COMMENT ON COLUMN "monitoreo_agua"."aud_usuario_elimina" IS 'Id del usuario que eliminó el registro';
COMMENT ON COLUMN "monitoreo_agua"."aud_fecha_elimina" IS 'Fecha de eliminación del registro';
COMMENT ON COLUMN "monitoreo_agua"."state" IS 'Estado del registro true = eliminado';
COMMENT ON COLUMN "monitoreo_agua"."codigo" IS 'Código único del registro';

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
COMMENT ON COLUMN "roles"."aud_usuario_crea" IS 'Id del usuario que creo el registro';
COMMENT ON COLUMN "roles"."aud_fecha_crea" IS 'Fecha de creación del registro';
COMMENT ON COLUMN "roles"."aud_usuario_modifica" IS 'Id del usuario que actualizó el registro';
COMMENT ON COLUMN "roles"."aud_fecha_modifica" IS 'Fecha de actualización del registro';
COMMENT ON COLUMN "roles"."aud_usuario_elimina" IS 'Id del usuario que eliminó el registro';
COMMENT ON COLUMN "roles"."aud_fecha_elimina" IS 'Fecha de eliminación del registro';
COMMENT ON COLUMN "roles"."state" IS 'Estado del registro true = eliminado';
COMMENT ON COLUMN "roles"."codigo" IS 'Código único del registro';

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
COMMENT ON COLUMN "recurso_roles"."aud_usuario_crea" IS 'Id del usuario que creo el registro';
COMMENT ON COLUMN "recurso_roles"."aud_fecha_crea" IS 'Fecha de creación del registro';
COMMENT ON COLUMN "recurso_roles"."aud_usuario_modifica" IS 'Id del usuario que actualizó el registro';
COMMENT ON COLUMN "recurso_roles"."aud_fecha_modifica" IS 'Fecha de actualización del registro';
COMMENT ON COLUMN "recurso_roles"."aud_usuario_elimina" IS 'Id del usuario que eliminó el registro';
COMMENT ON COLUMN "recurso_roles"."aud_fecha_elimina" IS 'Fecha de eliminación del registro';
COMMENT ON COLUMN "recurso_roles"."state" IS 'Estado del registro true = eliminado';
COMMENT ON COLUMN "recurso_roles"."codigo" IS 'Código único del registro';

-- usuario comments
COMMENT ON TABLE "usuario" IS 'Tabla de usuarios';
COMMENT ON COLUMN "usuario"."id" IS 'Id único del usuario';
COMMENT ON COLUMN "usuario"."nombre" IS 'Nombre/s propios del usuario';
COMMENT ON COLUMN "usuario"."apellido_paterno" IS 'Primer apellido del usuario';
COMMENT ON COLUMN "usuario"."apellido_materno" IS 'Segundo apellido del usuario';
COMMENT ON COLUMN "usuario"."ci" IS 'Cédula de identidad del usuario';
COMMENT ON COLUMN "usuario"."direccion" IS 'Dirección del usuario';
COMMENT ON COLUMN "usuario"."nombre_usuario" IS 'Nombre de usuario para inicar sesión';
COMMENT ON COLUMN "usuario"."correo" IS 'Correo del usuario';
COMMENT ON COLUMN "usuario"."telefono" IS 'Teléfono del usuario';
COMMENT ON COLUMN "usuario"."expiracion_cuenta" IS 'Fecha de expiración del la cuenta del usuario';
COMMENT ON COLUMN "usuario"."contraseña" IS 'Contraseña encriptada del usuario';
COMMENT ON COLUMN "usuario"."bloqueado_hasta" IS 'Bloqueado hasta';
COMMENT ON COLUMN "usuario"."tfa_activo" IS '2FA (Por correo) activado si / no';
COMMENT ON COLUMN "usuario"."codigo_verificacion" IS 'Codigo de verificación del usuario';
COMMENT ON COLUMN "usuario"."expiracion_codigo_verificacion" IS 'Fecha de expiración del código de verificación';
COMMENT ON COLUMN "usuario"."codigo_verificacion_revisado" IS 'Código de verificación revisado';
COMMENT ON COLUMN "usuario"."estado_usuario" IS 'Estado del usuario';
COMMENT ON COLUMN "usuario"."id_imagen" IS 'Id del adjunto de la foto del usuario';
COMMENT ON COLUMN "usuario"."id_rol" IS 'Id del rol del usuario';
COMMENT ON COLUMN "usuario"."aud_usuario_crea" IS 'Id del usuario que creo el registro';
COMMENT ON COLUMN "usuario"."aud_fecha_crea" IS 'Fecha de creación del registro';
COMMENT ON COLUMN "usuario"."aud_usuario_modifica" IS 'Id del usuario que actualizó el registro';
COMMENT ON COLUMN "usuario"."aud_fecha_modifica" IS 'Fecha de actualización del registro';
COMMENT ON COLUMN "usuario"."aud_usuario_elimina" IS 'Id del usuario que eliminó el registro';
COMMENT ON COLUMN "usuario"."aud_fecha_elimina" IS 'Fecha de eliminación del registro';
COMMENT ON COLUMN "usuario"."state" IS 'Estado del registro true = eliminado';
COMMENT ON COLUMN "usuario"."codigo" IS 'Código único del registro';
