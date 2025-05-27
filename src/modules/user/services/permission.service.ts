import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DBConnection } from 'src/shared/db/prisma';
import { RoleNames } from 'prisma/seeders/data/roles';
import { PermissionsFilter } from '../dto/permission/permission.filter';
import { ListPermissionDto } from '../dto/permission/list-permission.dto';
import { PermissionResponse } from '../dto/permission/permission-response.dto';
import { FormPermissionDto } from '../dto/permission/form-permission.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PermissionService {
	private logger = new Logger(PermissionService.name);

	constructor(private db: DBConnection) {}

	async findAll(filter: PermissionsFilter) {
		this.logger.log(`Finding all permissions, with filter: ${filter}`);

		const { where, pagination } = filter;

		const [items, total] = await this.db.$transaction([
			this.db.resourceRoles.findMany({
				where,
				...pagination,
				include: {
					role: true,
					resource: true,
				},
			}),
			this.db.resourceRoles.count({ where }),
		]);

		return new ListPermissionDto(items, total);
	}

	async findAllResources(idRole: number) {
		this.logger.log(`Finding all resources, for: ${idRole}`);

		let where: Prisma.ResourcesWhereInput = {};

		let assignedIds = [];
		if (idRole) {
			const assigned = await this.db.resourceRoles.findMany({ where: { idRole } });

			if (assigned?.length) assignedIds = assigned.map((a) => a.idResource);

			where = {
				...where,
				id: { notIn: assignedIds },
			};
		}
		return this.db.resources.findMany({ where });
	}

	async findOne(idRole: number, idResource: number) {
		this.logger.log(`Finding permission with roleId: ${idResource} and resourceId: ${idResource}`);

		const permission = await this.db.resourceRoles.findUnique({
			where: { idRole_idResource: { idRole, idResource } },
			include: { role: true, resource: true },
		});

		if (!permission) throw new NotFoundException('Permission not found');

		return new PermissionResponse(permission);
	}

	async create(dto: FormPermissionDto) {
		this.logger.log(`Creating permission`);

		const permission = await this.db.resourceRoles.create({ data: dto, select: { role: true, resource: true } });

		return new PermissionResponse(permission);
	}

	async update(dto: FormPermissionDto) {
		this.logger.log(`Updating permission with role id: ${dto.idRole} and resource id: ${dto.idResource}`);

		const role = await this.db.resourceRoles.update({
			where: { idRole_idResource: { idRole: dto.idRole, idResource: dto.idResource } },
			data: dto,
		});

		return new PermissionResponse(role);
	}

	async delete(idRole: number, idResource: number) {
		this.logger.log(`Deleting permission with role id: ${idRole} and resource id: ${idResource}`);

		const role = await this.db.role.findUnique({ where: { id: idRole } });

		if (!role) throw new NotFoundException('Role not found');

		if (role.name === RoleNames.SUPER_ADMIN) throw new UnauthorizedException('You cannot delete the super admin role');

		await this.db.resourceRoles.delete({
			where: { idRole_idResource: { idRole, idResource } },
		});

		return true;
	}
}
