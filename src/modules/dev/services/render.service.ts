import { Injectable } from '@nestjs/common';
import * as ejs from 'ejs';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class RenderService {
	private emailsDir = path.resolve(`${process.cwd()}/src/shared/services/email/templates`);

	async renderEmail(template: string, data: any): Promise<string> {
		const filePath = path.join(this.emailsDir, `${template}.ejs`);
		return this.render(filePath, data);
	}

	async render(filePath: string, data: any): Promise<string> {
		if (!fs.existsSync(filePath)) throw new Error(`Template in ${filePath} not found`);

		const templateContent = fs.readFileSync(filePath, 'utf-8');
		return ejs.render(templateContent, data);
	}
}
