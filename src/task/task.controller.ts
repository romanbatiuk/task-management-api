import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskModel } from './task.model';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
	constructor(private readonly taskService: TaskService) {}

	@Get()
	getTasks(@Query() filterDto: GetTasksFilterDto): TaskModel[] {
		// If we have any filters defined, call taskService.getTasksWithFilters
		// otherwise, just get all tasks

		if (Object.keys(filterDto).length) {
			return this.taskService.getTasksWithFilters(filterDto);
		}
		return this.taskService.getAllTasks();
	}

	@Get(':id')
	getTaskById(@Param('id') id: string): TaskModel {
		return this.taskService.getTaskById(id);
	}

	@Post()
	createTask(@Body() dto: CreateTaskDto) {
		return this.taskService.createTask(dto);
	}

	@Patch(':id/status')
	updateTaskStatus(
		@Param('id') id: string,
		@Body('status') { status }: UpdateTaskStatusDto,
	): TaskModel {
		return this.taskService.updateTaskStatus(id, status);
	}

	@Delete(':id')
	deleteTaskById(@Param('id') id: string): void {
		return this.taskService.deleteTaskById(id);
	}
}
