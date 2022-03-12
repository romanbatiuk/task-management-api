import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.inderface';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(@InjectRepository(UserRepository) private readonly userRepository: UserRepository) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			secretOrKey: 'topSecret42',
		});
	}

	async validate(payload: JwtPayload): Promise<UserEntity> {
		const { username } = payload;
		const user: UserEntity = await this.userRepository.findOne({ username });
		if (!user) {
			throw new UnauthorizedException();
		}
		return user;
	}
}
