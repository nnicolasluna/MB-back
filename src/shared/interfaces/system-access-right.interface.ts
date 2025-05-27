export enum Rights {
	none = 'none',
	canView = 'canView',
	canUpdate = 'canUpdate',
	canCreate = 'canCreate',
	canDelete = 'canDelete',
	isAdmin = 'isAdmin',
	isSuperAdmin = 'isSuperAdmin',
}

export interface SystemAccessRights {
	resource: string | string[];
	right: Rights;
}
