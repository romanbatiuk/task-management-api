import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TASK_NOT_FOUND_ERROR } from './task.constants';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity, TaskStatus } from './task.entity';
import { UserEntity } from 'src/auth/user.entity';

@Injectable()
export class TaskService {
	constructor(@InjectRepository(TaskRepository) private readonly taskRepository: TaskRepository) {}

	getTasks(dto: GetTasksFilterDto, user: UserEntity): Promise<TaskEntity[]> {
		return this.taskRepository.getTasks(dto, user);
	}

	async getTaskById(id: string, user: UserEntity): Promise<TaskEntity> {
		const foundTask = await this.taskRepository.findOne({ where: { id, user } });
		if (!foundTask) {
			throw new NotFoundException(TASK_NOT_FOUND_ERROR);
		}
		return foundTask;
	}

	createTask(dto: CreateTaskDto, user: UserEntity): Promise<TaskEntity> {
		return this.taskRepository.createTask(dto, user);
	}

	async updateTaskStatus(id: string, status: TaskStatus, user: UserEntity): Promise<TaskEntity> {
		const task = await this.getTaskById(id, user);
		console.log(task);

		task.status = status;
		await this.taskRepository.save(task);
		return task;
	}

	async deleteTaskById(id: string, user: UserEntity): Promise<void> {
		const res = await this.taskRepository.delete({ id, user });

		if (res.affected === 0) {
			throw new NotFoundException(TASK_NOT_FOUND_ERROR);
		}
	}
}
