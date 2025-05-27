import { Controller, Get, Header } from '@nestjs/common';
import { RenderService } from '../services/render.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsPublic } from '@shared/decorators';
import { EmailService } from '@shared/services/email/email.service';

@Controller('render')
@ApiTags('Development Tools')
export class RenderController {
	constructor(
		private readonly renderService: RenderService,
		private readonly emailService: EmailService,
	) {}

	@IsPublic()
	@Get('email/confirmation')
	@ApiOperation({ summary: 'Render confirmation email' })
	@Header('Content-Type', 'text/html')
	async getConfirmationEmail() {
		const data = {
			mainColor: this.emailService.mainColor,
			logo: '',
			url: '',
			name: 'John Doe',
		};

		return await this.renderService.renderEmail('confirmation-email', data);
	}

	@IsPublic()
	@Get('email/recover')
	@ApiOperation({ summary: 'Render recover password email' })
	@Header('Content-Type', 'text/html')
	async getRecoverEmail() {
		const data = {
			mainColor: this.emailService.mainColor,
			name: 'John Doe',
			url: '',
		};

		return await this.renderService.renderEmail('recover-password-email', data);
	}
}
