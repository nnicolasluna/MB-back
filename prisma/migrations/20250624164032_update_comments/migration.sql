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
