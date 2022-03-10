import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { TaskModel, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TASK_NOT_FOUND_ERROR } from './task.constants';

@Injectable()
export class TaskService {
	private tasks: TaskModel[] = [];

	getAllTasks(): TaskModel[] {
		return this.tasks;
	}

	getTasksWithFilters(filterDto: GetTasksFilterDto): TaskModel[] {
		const { status, search } = filterDto;

		// define a temporary array to hold the result
		let tasks = this.getAllTasks();

		// do something with status
		if (status) {
			tasks = tasks.filter((task) => task.status === status);
		}

		// do something with search
		if (search) {
			tasks = tasks.filter((task) => {
				if (task.title.includes(search) || task.description.includes(search)) {
					return true;
				}
				return false;
			});
		}

		// return final result
		return tasks;
	}

	getTaskById(id: string): TaskModel {
		const foundTask = this.tasks.find((task) => task.id === id);
		if (!foundTask) {
			throw new NotFoundException(TASK_NOT_FOUND_ERROR);
		}
		return foundTask;
	}

	createTask({ title, description }: CreateTaskDto): TaskModel {
		const task: TaskModel = {
			id: uuidv4(),
			title,
			description,
			status: TaskStatus.OPEN,
		};

		this.tasks.push(task);

		return task;
	}

	updateTaskStatus(id: string, status: TaskStatus) {
		const task = this.getTaskById(id);
		task.status = status;
		return task;
	}

	deleteTaskById(id: string): void {
		const foundTask = this.getTaskById(id);
		this.tasks.filter((task) => task.id !== foundTask.id);
	}
}
