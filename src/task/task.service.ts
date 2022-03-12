import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TASK_NOT_FOUND_ERROR } from './task.constants';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity, TaskStatus } from './task.entity';

@Injectable()
export class TaskService {
	constructor(@InjectRepository(TaskRepository) private readonly taskRepository: TaskRepository) {}

	getTasks(dto: GetTasksFilterDto): Promise<TaskEntity[]> {
		return this.taskRepository.getTasks(dto);
	}

	async getTaskById(id: string): Promise<TaskEntity> {
		const foundTask = await this.taskRepository.findOne(id);
		if (!foundTask) {
			throw new NotFoundException(TASK_NOT_FOUND_ERROR);
		}
		return foundTask;
	}

	createTask(dto: CreateTaskDto): Promise<TaskEntity> {
		return this.taskRepository.createTask(dto);
	}

	async updateTaskStatus(id: string, status: TaskStatus): Promise<TaskEntity> {
		const task = await this.getTaskById(id);
		console.log(task);

		task.status = status;
		await this.taskRepository.save(task);
		return task;
	}

	async deleteTaskById(id: string): Promise<void> {
		const res = await this.taskRepository.delete(id);

		if (res.affected === 0) {
			throw new NotFoundException(TASK_NOT_FOUND_ERROR);
		}
	}
}
