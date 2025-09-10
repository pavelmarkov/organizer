import { Body, Controller, Get, Post } from "@nestjs/common";
import { ProjectsService } from "../services/";
import { ProjectEntity } from "../entities";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  getProjects(): Promise<ProjectEntity[]> {
    return this.projectsService.get();
  }

  @Post()
  createProjects(@Body() params: ProjectEntity[]): Promise<ProjectEntity[]> {
    return this.projectsService.create(params);
  }
}
