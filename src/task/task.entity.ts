import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TaskStatus {
	OPEN = 'OPEN',
	IN_PROGRESS = 'IN_PROGRESS',
	DONE = 'DONE',
}

@Entity('tasks')
export class TaskEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	title: string;

	@Column()
	description: string;

	@Column()
	status: TaskStatus;
}
