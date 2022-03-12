import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserEntity } from './user.entity';
import { genSalt, hash } from 'bcryptjs';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
	async createUser(dto: AuthCredentialsDto): Promise<void> {
		const { username, password } = dto;

		const salt = await genSalt(10);
		const passwordHash = await hash(password, salt);

		const user = this.create({ username, password: passwordHash });

		try {
			await this.save(user);
		} catch (error) {
			if (error.code === '23505') {
				throw new ConflictException('Username already exists');
			} else {
				throw new InternalServerErrorException();
			}
		}
	}
}
