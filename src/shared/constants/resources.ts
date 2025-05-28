export const ResourceTypes = Object.freeze({
	MENU_USERS: 'MENU_USERS',
	USERS: 'USERS',
	ROLES: 'ROLES',
	SYSTEM_PERMISSIONS: 'SYSTEM_PERMISSIONS',
	LOG_ACTIVITIES: 'LOG_ACTIVITIES',

	// MENU_CONVOCATIONS: 'MENU_CONVOCATIONS', // Reuniones y Convocatorias
	// SESSIONS: 'SESSIONS', // Administración de Sesiones
	// SCHEDULE: 'SCHEDULE', // Administración de Agenda
	//
	// MENU_MEMBERS: 'MENU_MEMBERS', // Monitoreo y Comite
	// GROUPS: 'GROUPS', // Grupos de Trabajo
	//
	// MENU_NOTES: 'MENU_NOTES', // Actos Administrativos
	// NOTES: 'NOTES', // Seguimiento de Actas
	//
	// MENU_REPOSITORY: 'MENU_REPOSITORY', // Repositorio de Documentos
	// DOCUMENTS: 'DOCUMENTS', // Administración de Documentos
	// OFICIAL_DOCUMENTS: 'OFFICIAL_DOCUMENTS', // Documentos Oficiales

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
]);
