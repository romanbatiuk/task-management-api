import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('signup')
	async signUp(@Body() dto: AuthCredentialsDto): Promise<void> {
		return this.authService.signUp(dto);
	}

	@Post('signin')
	async signIn(@Body() dto: AuthCredentialsDto): Promise<{ accessToken: string }> {
		return this.authService.signIn(dto);
	}
}
