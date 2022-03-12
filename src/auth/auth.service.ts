import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './user.repository';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.inderface';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserRepository) private readonly userRepository: UserRepository,
		private readonly jwtService: JwtService,
	) {}

	async signUp(dto: AuthCredentialsDto): Promise<void> {
		return this.userRepository.createUser(dto);
	}

	async signIn(dto: AuthCredentialsDto): Promise<{ accessToken: string }> {
		const { username, password } = dto;
		const user = await this.userRepository.findOne({ username });

		if (user && (await compare(password, user.password))) {
			const payload: JwtPayload = { username };
			const accessToken: string = await this.jwtService.sign(payload);
			return {
				accessToken,
			};
		}
		throw new UnauthorizedException('Please check your login credentials');
	}
}
