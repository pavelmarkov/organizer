import { Injectable } from "@nestjs/common";
import { MemoryEntity } from "../../entities";
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
export class MemoriesRepository
  implements BaseAbstractRepository<MemoryEntity>
{
  constructor(
    @InjectRepository(MemoryEntity)
    private readonly memoryRepository: EntityRepository<MemoryEntity>,
    private readonly asyncLocalStorage: AsyncLocalStorage<any>,
  ) {}

  private formWhereCondition(
    filter?: FilterQuery<MemoryEntity>,
  ): FilterQuery<MemoryEntity> {
    const projectId = this.asyncLocalStorage.getStore()["projectId"];

    const projectIdCondition: FilterQuery<MemoryEntity> = [
      {
        projectId: projectId ?? null,
      },
    ];

    const searchValueCondition: FilterQuery<MemoryEntity> = [];

    const whereCondition: FilterQuery<MemoryEntity> = [
      ...projectIdCondition,
      ...searchValueCondition,
    ];

    if (filter) {
      whereCondition.push(filter);
    }

    return { $and: whereCondition };
  }

  async findAll(params: {
    filter?: Partial<MemoryEntity>;
    pagination?: { limit: number; offset: number };
    order?: OrderDefinition<MemoryEntity>;
  }): Promise<MemoryEntity[]> {
    const { filter, pagination, order } = params;

    const whereCondition = this.formWhereCondition(filter);

    return await this.memoryRepository.findAll({
      where: whereCondition,
      orderBy: order,
      offset: pagination?.offset ?? 0,
      limit: pagination?.limit ?? 10,
    });
  }

  async count(filter?: Partial<MemoryEntity>): Promise<number> {
    const whereCondition = this.formWhereCondition(filter);

    return await this.memoryRepository.count(whereCondition);
  }

  async findOne(id: string): Promise<MemoryEntity> {
    return await this.memoryRepository.findOne({
      id,
    });
  }

  async update(
    memories: (Partial<MemoryEntity> & Pick<MemoryEntity, "id">)[],
  ): Promise<MemoryEntity[]> {
    if (!memories.length) {
      return [];
    }

    const memoryIds = memories.map((memory) => memory.id);

    const currentMemories = await this.memoryRepository.findAll({
      where: {
        id: { $in: memoryIds },
      },
    });

    currentMemories.forEach((memory) => {
      const updateData = memories.find(
        (updateDataMemory) => updateDataMemory.id === memory.id,
      );
      Object.assign(memory, { ...updateData, projectId: memory.projectId });
    });

    return await this.memoryRepository.upsertMany(currentMemories, {
      onConflictFields: ["id"],
      onConflictAction: "merge",
      onConflictMergeFields: ["description", "name"],
    });
  }

  async delete(
    memories: (Partial<MemoryEntity> & Pick<MemoryEntity, "id">)[],
  ): Promise<MemoryEntity[]> {
    if (!memories.length) {
      return [];
    }

    const memoryIds = memories.map((memory) => memory.id);

    const currentMemories = await this.memoryRepository.findAll({
      where: {
        id: { $in: memoryIds },
      },
    });

    await this.memoryRepository.nativeDelete({
      id: { $in: memoryIds },
    });

    return currentMemories;
  }

  async upsertMany(
    memories: (Partial<MemoryEntity> & Pick<MemoryEntity, "name">)[],
  ): Promise<MemoryEntity[]> {
    const projectId = this.asyncLocalStorage.getStore()["projectId"];

    memories.forEach((memory) => {
      memory.id = uuidv4();
      memory.projectId = projectId;
    });

    return await this.memoryRepository.upsertMany(memories, {
      onConflictFields: ["name"],
      onConflictAction: "merge",
      onConflictMergeFields: ["description"],
    });
  }

  async getNextItemId(currentItem: MemoryEntity): Promise<string | null> {
    const nextItem = await this.memoryRepository.findOne(
      this.formWhereCondition({
        name: { $gt: currentItem.name },
      }),
      { orderBy: { name: "asc" } },
    );

    if (nextItem) {
      return nextItem.id;
    }

    const firstItem = await this.memoryRepository.findOne(
      this.formWhereCondition(),
      { orderBy: { name: "asc" } },
    );

    if (firstItem) {
      return firstItem.id;
    }

    return null;
  }

  async getPreviousItemId(currentItem: MemoryEntity): Promise<string | null> {
    const previousItem = await this.memoryRepository.findOne(
      this.formWhereCondition({
        name: { $lt: currentItem.name },
      }),
      { orderBy: { name: "desc" } },
    );

    if (previousItem) {
      return previousItem.id;
    }

    const lastItem = await this.memoryRepository.findOne(
      this.formWhereCondition(),
      { orderBy: { name: "desc" } },
    );

    if (lastItem) {
      return lastItem.id;
    }

    return null;
  }
}
