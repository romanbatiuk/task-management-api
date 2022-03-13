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
import { GetUser } from 'src/auth/get-user.decorator';
import { UserEntity } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskEntity } from './task.entity';
import { TaskService } from './task.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TaskController {
	constructor(private readonly taskService: TaskService) {}

	@Get()
	async getTasks(
		@Query() filterDto: GetTasksFilterDto,
		@GetUser() user: UserEntity,
	): Promise<TaskEntity[]> {
		if (Object.keys(filterDto).length) {
			return this.taskService.getTasks(filterDto, user);
		}
		return this.taskService.getTasks(filterDto, user);
	}

	@Get(':id')
	async getTaskById(@Param('id') id: string, @GetUser() user: UserEntity): Promise<TaskEntity> {
		return this.taskService.getTaskById(id, user);
	}

	@Post()
	async createTask(@Body() dto: CreateTaskDto, @GetUser() user: UserEntity): Promise<TaskEntity> {
		return this.taskService.createTask(dto, user);
	}

	@Patch(':id/status')
	async updateTaskStatus(
		@Param('id') id: string,
		@Body() { status }: UpdateTaskStatusDto,
		@GetUser() user: UserEntity,
	): Promise<TaskEntity> {
		return this.taskService.updateTaskStatus(id, status, user);
	}

	@Delete(':id')
	async deleteTaskById(@Param('id') id: string, @GetUser() user: UserEntity): Promise<void> {
		return this.taskService.deleteTaskById(id, user);
	}
}
