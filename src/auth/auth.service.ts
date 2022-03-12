import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
	constructor(@InjectRepository(UserRepository) private readonly userRepository: UserRepository) {}

	async signUp(dto: AuthCredentialsDto): Promise<void> {
		return this.userRepository.createUser(dto);
	}
}
