import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskEntity } from './task.entity';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
	constructor(private readonly taskService: TaskService) {}

	@Get()
	@UseGuards(AuthGuard())
	async getTasks(@Query() filterDto: GetTasksFilterDto): Promise<TaskEntity[]> {
		if (Object.keys(filterDto).length) {
			return this.taskService.getTasks(filterDto);
		}
		return this.taskService.getTasks(filterDto);
	}

	@Get(':id')
	async getTaskById(@Param('id') id: string): Promise<TaskEntity> {
		return this.taskService.getTaskById(id);
	}

	@Post()
	async createTask(@Body() dto: CreateTaskDto): Promise<TaskEntity> {
		return this.taskService.createTask(dto);
	}

	@Patch(':id/status')
	async updateTaskStatus(
		@Param('id') id: string,
		@Body() { status }: UpdateTaskStatusDto,
	): Promise<TaskEntity> {
		return this.taskService.updateTaskStatus(id, status);
	}

	@Delete(':id')
	async deleteTaskById(@Param('id') id: string): Promise<void> {
		return this.taskService.deleteTaskById(id);
	}
}
