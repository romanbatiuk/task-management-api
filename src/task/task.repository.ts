import { UserEntity } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskEntity, TaskStatus } from './task.entity';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
	async getTasks({ status, search }: GetTasksFilterDto, user: UserEntity): Promise<TaskEntity[]> {
		const query = this.createQueryBuilder('task');
		query.where({ user });

		if (status) {
			query.andWhere('task.status = :status', { status });
		}

		if (search) {
			query.andWhere(
				'(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
				{
					search: `%${search}%`,
				},
			);
		}

		const tasks = await query.getMany();
		return tasks;
	}

	async createTask({ title, description }: CreateTaskDto, user: UserEntity): Promise<TaskEntity> {
		const task = this.create({ title, description, status: TaskStatus.OPEN, user });
		await this.save(task);
		return task;
	}
}
