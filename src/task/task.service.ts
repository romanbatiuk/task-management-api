import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
	private tasks = ['task 1', 'task 2'];

	getAllTasks() {
		return this.tasks;
	}
}
