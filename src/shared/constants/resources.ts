export const ResourceTypes = Object.freeze({
	MENU_USERS: 'MENU_USERS',
	MENU_MEETS: 'MENU_MEETS',
	USERS: 'USERS',
	ROLES: 'ROLES',
	MENU_GROUP: 'MENU_GROUP',
	AGENDA: 'AGENDA',
	GROUP: 'GROUP',
	OFFICIAL: 'OFFICIAL',
	EVENTS: 'EVENTS',
	GROUPMEET: 'GROUPMEET',
	MENU_DOCS: 'MENU_DOCS',
	SYSTEM_PERMISSIONS: 'SYSTEM_PERMISSIONS',
	LOG_ACTIVITIES: 'LOG_ACTIVITIES',
	MENU_PROCEEDINGS: 'MENU_PROCEEDINGS',

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
	{
		name: 'Menú Reuniones y Convocatorias',
		code: ResourceTypes.MENU_MEETS,
		type: 'VIEW',
	},
	{
		name: 'Administración de Agenda',
		code: ResourceTypes.AGENDA,
		type: 'MODULE',
	},
	{
		name: 'Menú Miembros y Comite',
		code: ResourceTypes.MENU_GROUP,
		type: 'VIEW',
	},
	{
		name: 'Grupos de Trabajo',
		code: ResourceTypes.GROUP,
		type: 'MODULE',
	},
	{
		name: 'Repositorio de Información y Documentos',
		code: ResourceTypes.MENU_DOCS,
		type: 'VIEW',
	},
	{
		name: 'Documentos Oficiales',
		code: ResourceTypes.OFFICIAL,
		type: 'MODULE',
	},
	{
		name: 'Seguimiento de Actas',
		code: ResourceTypes.MENU_PROCEEDINGS,
		type: 'VIEW',
	},
	{
		name: 'Seguimiento de Actas',
		code: ResourceTypes.EVENTS,
		type: 'MODULE',
	},
	{
		name: 'Reuniones y Sesiones por Grupo',
		code: ResourceTypes.GROUPMEET,
		type: 'MODULE',
	},
]);
