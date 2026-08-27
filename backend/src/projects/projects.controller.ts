import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, UserPayload } from '../common/decorators/current-user.decorator';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  async create(
    @CurrentUser() user: UserPayload,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectsService.create(user.userId, createProjectDto);
  }

  @Get()
  async findAll(@CurrentUser() user: UserPayload) {
    return this.projectsService.findAllForUser(user.userId);
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: UserPayload,
    @Param('id') projectId: string,
  ) {
    return this.projectsService.findOneForUser(user.userId, projectId);
  }

  @Patch(':id')
  async update(
    @CurrentUser() user: UserPayload,
    @Param('id') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.updateForUser(user.userId, projectId, updateProjectDto);
  }

  @Delete(':id')
  async delete(
    @CurrentUser() user: UserPayload,
    @Param('id') projectId: string,
  ) {
    return this.projectsService.deleteForUser(user.userId, projectId);
  }
}
