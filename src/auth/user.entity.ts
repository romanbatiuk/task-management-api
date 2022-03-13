import { TaskEntity } from 'src/task/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	username: string;

	@Column()
	password: string;

	@OneToMany((_type) => TaskEntity, (task) => task.user, { eager: true })
	tasks: TaskEntity[];
}
