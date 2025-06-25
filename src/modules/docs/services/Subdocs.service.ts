import { Injectable } from '@nestjs/common';
import { SimplePrismaService } from '@shared/db/prisma.simple';

@Injectable()
export class SubDocsService {
	constructor(private db: SimplePrismaService) {}
	async create(createDocDto: any) {
		const { tituloSub, nombreArchivo, documentosId } = createDocDto;

		return await this.db.subdocumentos.create({
			data: {
				tituloSub,
				nombreArchivo,
				documentosId,
			},
		});
	}

	async findAll() {
		const data = await this.db.subdocumentos.findMany();

		return {
			items: data,
			total: data.length,
		};
	}

	findOne(id: number) {
		return this.db.subdocumentos.findUnique({
			where: { id },
		});
	}

	update(id: number, updateDocDto: any) {
		return updateDocDto;
	}
}
