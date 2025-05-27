export const ResourceTypes = Object.freeze({
	MENU_USERS: 'MENU_USERS',
	USERS: 'USERS',
	ROLES: 'ROLES',
	SYSTEM_PERMISSIONS: 'SYSTEM_PERMISSIONS',
	LOG_ACTIVITIES: 'LOG_ACTIVITIES',

	MENU_CARTOGRAPHIC: 'MENU_CARTOGRAPHIC',
	CARTOGRAPHIC_RESOURCES: 'CARTOGRAPHIC_RESOURCES',
	CARTOGRAPHIC_STYLES: 'CARTOGRAPHIC_STYLES',

	MENU_MONITORING: 'MENU_MONITORING',
	FIRE_MONITORING: 'FIRE_MONITORING',

	ATTACHMENTS: 'ATTACHMENTS',
});

export const Resources = Object.freeze([
	{
		name: 'Menú Usuarios',
		code: ResourceTypes.MENU_USERS,
		type: 'VIEW',
	},
	{
		name: 'Usuarios',
		code: ResourceTypes.USERS,
		type: 'MODULE',
	},
	{
		name: 'Roles',
		code: ResourceTypes.ROLES,
		type: 'MODULE',
	},
	{
		name: 'Permisos Sistema',
		code: ResourceTypes.SYSTEM_PERMISSIONS,
		type: 'MODULE',
	},
	{
		name: 'Log de Actividades',
		code: ResourceTypes.LOG_ACTIVITIES,
		type: 'MODULE',
	},
	{
		name: 'Menú Mapas',
		code: ResourceTypes.MENU_CARTOGRAPHIC,
		type: 'VIEW',
	},
	{
		name: 'Administración de Mapas',
		code: ResourceTypes.CARTOGRAPHIC_RESOURCES,
		type: 'MODULE',
	},
	{
		name: 'Administración de Estilos',
		code: ResourceTypes.CARTOGRAPHIC_STYLES,
		type: 'MODULE',
	},
	{
		name: 'Menú Monitoreo',
		code: ResourceTypes.MENU_MONITORING,
		type: 'VIEW',
	},
	// {
	// 	name: 'Monitoreo de Fuego',
	// 	code: ResourceTypes.FIRE_MONITORING,
	// 	type: 'MODULE',
	// },
]);
