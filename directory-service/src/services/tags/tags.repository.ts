import { Injectable } from "@nestjs/common";
import { TagEntity } from "../../entities";
import { InjectRepository } from "@mikro-orm/nestjs";
import {
  EntityRepository,
  FilterQuery,
  OrderDefinition,
} from "@mikro-orm/sqlite";
import { v4 as uuidv4 } from "uuid";
import { AsyncLocalStorage } from "node:async_hooks";
import { BaseAbstractRepository } from "../../domain/repositories";

@Injectable()
export class TagRepository implements BaseAbstractRepository<TagEntity> {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: EntityRepository<TagEntity>,
    private readonly asyncLocalStorage: AsyncLocalStorage<any>,
  ) {}

  private formWhereCondition(
    filter?: FilterQuery<TagEntity>,
  ): FilterQuery<TagEntity> {
    const projectId = this.asyncLocalStorage.getStore()["projectId"];
    const searchValue = this.asyncLocalStorage.getStore()["searchValue"];

    const projectIdCondition: FilterQuery<TagEntity> = [
      {
        projectId: projectId ?? null,
      },
    ];

    const searchValueCondition: FilterQuery<TagEntity> = [];
    if (searchValue) {
      searchValueCondition.push({
        $or: [
          { name: { $like: `%${searchValue}%` } },
          { description: { $like: `%${searchValue}%` } },
        ],
      });
    }

    const whereCondition: FilterQuery<TagEntity> = [
      ...projectIdCondition,
      ...searchValueCondition,
    ];

    if (filter) {
      whereCondition.push(filter);
    }

    return { $and: whereCondition };
  }

  async findAll(params: {
    filter?: Partial<TagEntity>;
    pagination?: { limit: number; offset: number };
    order?: OrderDefinition<TagEntity>;
  }): Promise<TagEntity[]> {
    const { filter, pagination, order } = params;

    const whereCondition = this.formWhereCondition(filter);

    return await this.tagRepository.findAll({
      where: whereCondition,
      orderBy: order,
      offset: pagination?.offset ?? null,
      limit: pagination?.limit ?? null,
    });
  }

  async count(filter?: Partial<TagEntity>): Promise<number> {
    filter = filter ?? {};
    filter.parentId = filter.parentId ?? null;

    const whereCondition = this.formWhereCondition(filter);

    return await this.tagRepository.count(whereCondition);
  }

  async findOne(id: string): Promise<TagEntity> {
    return await this.tagRepository.findOne({
      tagId: id,
    });
  }

  async update(
    tags: (Partial<TagEntity> & Pick<TagEntity, "tagId">)[],
  ): Promise<TagEntity[]> {
    if (!tags.length) {
      return [];
    }

    const tagIds = tags.map((tag) => tag.tagId);

    const currentTags = await this.tagRepository.findAll({
      where: {
        tagId: { $in: tagIds },
      },
    });

    currentTags.forEach((tag) => {
      const updateData = tags.find(
        (updateDataTag) => updateDataTag.tagId === tag.tagId,
      );
      Object.assign(tag, updateData);
    });

    return await this.tagRepository.upsertMany(currentTags, {
      onConflictFields: ["tagId"],
      onConflictAction: "merge",
      onConflictMergeFields: ["description"],
    });
  }

  async delete(
    tags: (Partial<TagEntity> & Pick<TagEntity, "tagId">)[],
  ): Promise<TagEntity[]> {
    if (!tags.length) {
      return [];
    }

    const tagIds = tags.map((tag) => tag.tagId);

    const currentTags = await this.tagRepository.findAll({
      where: {
        tagId: { $in: tagIds },
      },
    });

    await this.tagRepository.nativeDelete({
      tagId: { $in: tagIds },
    });

    return currentTags;
  }

  async upsertMany(
    tags: (Partial<TagEntity> & Pick<TagEntity, "name">)[],
  ): Promise<TagEntity[]> {
    const projectId = this.asyncLocalStorage.getStore()["projectId"];

    tags.forEach((tag) => {
      tag.tagId = uuidv4();
      tag.projectId = projectId;
    });

    return await this.tagRepository.upsertMany(tags, {
      onConflictFields: ["name"],
      onConflictAction: "ignore",
    });
  }

  async getNextItemId(currentItem: TagEntity): Promise<string | null> {
    const nextItem = await this.tagRepository.findOne(
      this.formWhereCondition({
        name: { $gt: currentItem.name },
        parentId: currentItem.parentId,
      }),
      { orderBy: { name: "asc" } },
    );

    if (nextItem) {
      return nextItem.tagId;
    }

    const firstItem = await this.tagRepository.findOne(
      this.formWhereCondition({ parentId: currentItem.parentId }),
      { orderBy: { name: "asc" } },
    );

    if (firstItem) {
      return firstItem.tagId;
    }

    return null;
  }

  async getPreviousItemId(currentItem: TagEntity): Promise<string | null> {
    const previousItem = await this.tagRepository.findOne(
      this.formWhereCondition({
        name: { $lt: currentItem.name },
        parentId: currentItem.parentId,
      }),
      { orderBy: { name: "desc" } },
    );

    if (previousItem) {
      return previousItem.tagId;
    }

    const lastItem = await this.tagRepository.findOne(
      this.formWhereCondition({ parentId: currentItem.parentId }),
      { orderBy: { name: "desc" } },
    );

    if (lastItem) {
      return lastItem.tagId;
    }

    return null;
  }
}
