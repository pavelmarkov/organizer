import { Injectable } from "@nestjs/common";
import { ProjectEntity } from "../../entities";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/sqlite";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: EntityRepository<ProjectEntity>
  ) {}

  async getProjects(): Promise<ProjectEntity[]> {
    return await this.projectRepository.findAll();
  }

  async createProjects(
    projects: Partial<ProjectEntity[]>
  ): Promise<ProjectEntity[]> {
    projects.forEach((project) => {
      project.projectId = uuidv4();
    });
    return await this.projectRepository.upsertMany(projects, {
      onConflictFields: ["name"],
      onConflictAction: "ignore",
    });
  }
}
