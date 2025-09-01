import { Injectable } from "@nestjs/common";
import { TagEntity } from "../../entities";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/sqlite";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagsRepository: EntityRepository<TagEntity>
  ) {}

  async getTags(): Promise<TagEntity[]> {
    return await this.tagsRepository.findAll();
  }

  async createTags(tags: Partial<TagEntity[]>): Promise<TagEntity[]> {
    tags.forEach((tags) => {
      tags.tagId = uuidv4();
    });
    return await this.tagsRepository.upsertMany(tags, {
      onConflictFields: ["name"],
      onConflictAction: "ignore",
    });
  }
}
