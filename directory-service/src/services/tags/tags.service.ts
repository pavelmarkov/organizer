import { Injectable } from "@nestjs/common";
import { TagEntity } from "../../entities";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/sqlite";
import { v4 as uuidv4 } from "uuid";
import { AsyncLocalStorage } from "node:async_hooks";
import { BaseAbstractService } from "../../domain/services";

@Injectable()
export class TagsService implements BaseAbstractService<TagEntity> {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagsRepository: EntityRepository<TagEntity>,
    private readonly asyncLocalStorage: AsyncLocalStorage<any>
  ) {}

  async get(): Promise<TagEntity[]> {
    const projectId = this.asyncLocalStorage.getStore()["projectId"];
    return await this.tagsRepository.findAll({
      where: {
        projectId: projectId ?? null,
      },
    });
  }

  async create(tags: Partial<TagEntity[]>): Promise<TagEntity[]> {
    const projectId = this.asyncLocalStorage.getStore()["projectId"];

    tags.forEach((tag) => {
      tag.tagId = uuidv4();
      tag.projectId = projectId;
    });

    return await this.tagsRepository.upsertMany(tags, {
      onConflictFields: ["name"],
      onConflictAction: "ignore",
    });
  }
}
