import { Body, Controller, Get, Param, Post, UnauthorizedException } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { CurrentUser, IsPublic, TrackActivity } from 'src/shared/decorators';
import { BasicLoginDto } from '../dto/basic-login.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ConfirmAccountDto } from '../dto/confirm-account.dto';
import { BasicLoginResponseDto } from '../dto/basic-login-response.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UserEntity } from '@modules/user/entities/user.entity';

@Controller('auth')
@ApiTags('Authorization')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@IsPublic()
	@Post('login')
	@ApiOperation({ summary: 'Basic login with user/email and password' })
	@ApiOkResponse({ type: BasicLoginResponseDto })
	basicLogin(@Body() basicLoginDto: BasicLoginDto) {
		return this.authService.basicLogin(basicLoginDto);
	}

	@IsPublic()
	@Get('verify/:code')
	@ApiOperation({ summary: 'Verify Token' })
	async verifyToken(@Param('code') code: string) {
		try {
			return await this.authService.verifyToken(code);
		} catch {
			throw new UnauthorizedException();
		}
	}

	@IsPublic()
	@Post('confirmation')
	@ApiBody({ type: ConfirmAccountDto })
	@ApiOperation({ summary: 'Confirm user account' })
	async confirmationAccount(@Body() confirmationDto: ConfirmAccountDto) {
		return this.authService.confirmAccount(confirmationDto);
	}

	@IsPublic()
	@Post('forgot-password')
	@ApiBody({ type: ForgotPasswordDto })
	@ApiOkResponse({ type: Boolean })
	@ApiOperation({ summary: 'Recovery password' })
	async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
		return this.authService.forgotPassword(forgotPasswordDto);
	}

	@Post('change-password')
	@TrackActivity('Log [Cambio de contraseña]')
	@ApiBody({ type: ChangePasswordDto })
	@ApiOperation({ summary: 'Change password' })
	@ApiOkResponse({ type: Boolean })
	async changePassword(@Body() changePasswordDto: ChangePasswordDto, @CurrentUser() user: UserEntity) {
		return this.authService.changePassword(changePasswordDto, user);
	}
}
