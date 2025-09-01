import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ProjectsService } from "../services/";
import { ProjectEntity } from "../entities";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  getProjects(): Promise<ProjectEntity[]> {
    return this.projectsService.getProjects();
  }

  @Post()
  createProjects(@Body() params: ProjectEntity[]): Promise<ProjectEntity[]> {
    return this.projectsService.createProjects(params);
  }
}
