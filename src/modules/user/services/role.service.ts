import { HttpException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DBConnection } from 'src/shared/db/prisma';
import { AuditDeleteFields, ExistsQuery } from 'src/shared/interfaces';
import { RolesFilter } from '../dto/role/role.filter';
import { ListRoleDto } from '../dto/role/list-role.dto';
import { RoleEntity } from '../entities/role.entity';
import { FormRoleDto } from '../dto/role/form-role.dto';
import { Roles } from 'prisma/seeders/data/roles';

@Injectable()
export class RoleService {
	private logger = new Logger(RoleService.name);

	constructor(private db: DBConnection) {}

	async findAll(filter: RolesFilter) {
		this.logger.log(`Finding all roles, with filter: ${filter}`);

		const { where, pagination } = filter;

		const [items, total] = await this.db.$transaction([
			this.db.role.findMany({
				where,
				...pagination,
			}),
			this.db.role.count({ where }),
		]);

		return new ListRoleDto(items, total);
	}

	async findOne(id: number) {
		this.logger.log(`Finding role with id: ${id}`);

		const role = await this.db.role.findUnique({ where: { id } });

		if (!role) throw new NotFoundException('Role not found');

		return new RoleEntity(role);
	}

	async create(dto: FormRoleDto) {
		this.logger.log(`Creating role`);

		const existsRole = await this.db.role.count({
			where: { name: dto.name },
		});

		if (existsRole > 0) throw new NotFoundException('Role already exists');

		const role = await this.db.role.create({ data: dto });

		return new RoleEntity(role);
	}

	async update(id: number, dto: FormRoleDto) {
		this.logger.log(`Updating role with id: ${id}`);

		const role = await this.db.role.update({
			where: { id },
			data: dto,
		});

		return new RoleEntity(role);
	}

	async delete(id: number, auditFields: AuditDeleteFields) {
		this.logger.log(`Deleting role with id: ${id}`);

		const role = await this.db.role.findUnique({ where: { id, NOT: { name: Roles[0].name } } });

		if (!role) throw new NotFoundException('Role not found');

		const isRoleUsed = await this.db.user.exists({ idRole: id });

		if (isRoleUsed) throw new HttpException('Role is being used', 423);

		await this.db.role.update({
			where: { id },
			data: { ...auditFields, state: false, name: `${auditFields.deletedAt}_${role?.name}` },
		});

		return true;
	}

	async checkIfExists({ value, field }: ExistsQuery) {
		try {
			this.logger.log(`Checking if role exists with ${field}: ${value}`);
			return this.db.role.exists({ [field]: value });
		} catch (error) {
			this.logger.error(`Error checking if role exists: ${error}`);
			return false;
		}
	}
}
