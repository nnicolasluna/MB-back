-- Prisma Database Comments Generator v1.1.0

-- archivos comments
COMMENT ON COLUMN "archivos"."aud_usuario_crea" IS 'Id del usuario que creo el registro';
COMMENT ON COLUMN "archivos"."aud_fecha_crea" IS 'Fecha de creación del registro';
COMMENT ON COLUMN "archivos"."aud_usuario_modifica" IS 'Id del usuario que actualizó el registro';
COMMENT ON COLUMN "archivos"."aud_fecha_modifica" IS 'Fecha de actualización del registro';
COMMENT ON COLUMN "archivos"."aud_usuario_elimina" IS 'Id del usuario que eliminó el registro';
COMMENT ON COLUMN "archivos"."aud_fecha_elimina" IS 'Fecha de eliminación del registro';
COMMENT ON COLUMN "archivos"."state" IS 'Estado del registro true = eliminado';
COMMENT ON COLUMN "archivos"."codigo" IS 'Código único del registro';

-- servicios_mapas_web comments
COMMENT ON COLUMN "servicios_mapas_web"."aud_usuario_crea" IS 'Id del usuario que creo el registro';
COMMENT ON COLUMN "servicios_mapas_web"."aud_fecha_crea" IS 'Fecha de creación del registro';
COMMENT ON COLUMN "servicios_mapas_web"."aud_usuario_modifica" IS 'Id del usuario que actualizó el registro';
COMMENT ON COLUMN "servicios_mapas_web"."aud_fecha_modifica" IS 'Fecha de actualización del registro';
COMMENT ON COLUMN "servicios_mapas_web"."aud_usuario_elimina" IS 'Id del usuario que eliminó el registro';
COMMENT ON COLUMN "servicios_mapas_web"."aud_fecha_elimina" IS 'Fecha de eliminación del registro';
COMMENT ON COLUMN "servicios_mapas_web"."state" IS 'Estado del registro true = eliminado';
COMMENT ON COLUMN "servicios_mapas_web"."codigo" IS 'Código único del registro';

-- recursos_cartograficos comments
COMMENT ON COLUMN "recursos_cartograficos"."aud_usuario_crea" IS 'Id del usuario que creo el registro';
COMMENT ON COLUMN "recursos_cartograficos"."aud_fecha_crea" IS 'Fecha de creación del registro';
COMMENT ON COLUMN "recursos_cartograficos"."aud_usuario_modifica" IS 'Id del usuario que actualizó el registro';
COMMENT ON COLUMN "recursos_cartograficos"."aud_fecha_modifica" IS 'Fecha de actualización del registro';
COMMENT ON COLUMN "recursos_cartograficos"."aud_usuario_elimina" IS 'Id del usuario que eliminó el registro';
COMMENT ON COLUMN "recursos_cartograficos"."aud_fecha_elimina" IS 'Fecha de eliminación del registro';
COMMENT ON COLUMN "recursos_cartograficos"."state" IS 'Estado del registro true = eliminado';
COMMENT ON COLUMN "recursos_cartograficos"."codigo" IS 'Código único del registro';

-- estilos_mapas comments
COMMENT ON COLUMN "estilos_mapas"."aud_usuario_crea" IS 'Id del usuario que creo el registro';
COMMENT ON COLUMN "estilos_mapas"."aud_fecha_crea" IS 'Fecha de creación del registro';
COMMENT ON COLUMN "estilos_mapas"."aud_usuario_modifica" IS 'Id del usuario que actualizó el registro';
COMMENT ON COLUMN "estilos_mapas"."aud_fecha_modifica" IS 'Fecha de actualización del registro';
COMMENT ON COLUMN "estilos_mapas"."aud_usuario_elimina" IS 'Id del usuario que eliminó el registro';
COMMENT ON COLUMN "estilos_mapas"."aud_fecha_elimina" IS 'Fecha de eliminación del registro';
COMMENT ON COLUMN "estilos_mapas"."state" IS 'Estado del registro true = eliminado';
COMMENT ON COLUMN "estilos_mapas"."codigo" IS 'Código único del registro';

-- tematicas_mapas comments
COMMENT ON COLUMN "tematicas_mapas"."aud_usuario_crea" IS 'Id del usuario que creo el registro';
COMMENT ON COLUMN "tematicas_mapas"."aud_fecha_crea" IS 'Fecha de creación del registro';
COMMENT ON COLUMN "tematicas_mapas"."aud_usuario_modifica" IS 'Id del usuario que actualizó el registro';
COMMENT ON COLUMN "tematicas_mapas"."aud_fecha_modifica" IS 'Fecha de actualización del registro';
COMMENT ON COLUMN "tematicas_mapas"."aud_usuario_elimina" IS 'Id del usuario que eliminó el registro';
COMMENT ON COLUMN "tematicas_mapas"."aud_fecha_elimina" IS 'Fecha de eliminación del registro';
COMMENT ON COLUMN "tematicas_mapas"."state" IS 'Estado del registro true = eliminado';
COMMENT ON COLUMN "tematicas_mapas"."codigo" IS 'Código único del registro';

-- roles comments
COMMENT ON COLUMN "roles"."aud_usuario_crea" IS 'Id del usuario que creo el registro';
COMMENT ON COLUMN "roles"."aud_fecha_crea" IS 'Fecha de creación del registro';
COMMENT ON COLUMN "roles"."aud_usuario_modifica" IS 'Id del usuario que actualizó el registro';
COMMENT ON COLUMN "roles"."aud_fecha_modifica" IS 'Fecha de actualización del registro';
COMMENT ON COLUMN "roles"."aud_usuario_elimina" IS 'Id del usuario que eliminó el registro';
COMMENT ON COLUMN "roles"."aud_fecha_elimina" IS 'Fecha de eliminación del registro';
COMMENT ON COLUMN "roles"."state" IS 'Estado del registro true = eliminado';
COMMENT ON COLUMN "roles"."codigo" IS 'Código único del registro';

-- recurso_roles comments
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
