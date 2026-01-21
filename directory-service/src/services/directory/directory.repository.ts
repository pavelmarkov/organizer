import { Injectable } from "@nestjs/common";
import { DirectoryEntity } from "../../entities";
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
export class DirectoryRepository
  implements BaseAbstractRepository<DirectoryEntity>
{
  constructor(
    @InjectRepository(DirectoryEntity)
    private readonly directoryRepository: EntityRepository<DirectoryEntity>,
    private readonly asyncLocalStorage: AsyncLocalStorage<any>,
  ) {}

  private formWhereCondition(
    filter?: FilterQuery<DirectoryEntity>,
  ): FilterQuery<DirectoryEntity> {
    const projectId = this.asyncLocalStorage.getStore()["projectId"];
    const searchValue = this.asyncLocalStorage.getStore()["searchValue"];

    const projectIdCondition: FilterQuery<DirectoryEntity> = [
      {
        projectId: projectId ?? null,
      },
    ];

    const searchValueCondition: FilterQuery<DirectoryEntity> = [];
    if (searchValue) {
      searchValueCondition.push(
        ...[{ path: { $like: `%${searchValue}%` } }, { isFolder: false }],
      );
    }

    const whereCondition: FilterQuery<DirectoryEntity> = [
      ...projectIdCondition,
      ...searchValueCondition,
    ];

    if (filter) {
      whereCondition.push(filter);
    }

    return { $and: whereCondition };
  }

  async findAll(params: {
    filter?: Partial<DirectoryEntity>;
    pagination?: { limit: number; offset: number };
    order?: OrderDefinition<DirectoryEntity>;
  }): Promise<DirectoryEntity[]> {
    const { filter, pagination, order } = params;

    const whereCondition = this.formWhereCondition(filter);

    // console.dir(whereCondition, { depth: null });

    return await this.directoryRepository.findAll({
      where: whereCondition,
      orderBy: order,
      offset: pagination?.offset,
      limit: pagination?.limit,
    });
  }

  async count(filter?: Partial<DirectoryEntity>): Promise<number> {
    const searchValue = this.asyncLocalStorage.getStore()["searchValue"];

    filter = filter ?? {};

    if (!searchValue) {
      filter.parentId = filter.parentId ?? null;
    }

    const whereCondition = this.formWhereCondition(filter);

    return await this.directoryRepository.count(whereCondition);
  }

  async findOne(id: string): Promise<DirectoryEntity> {
    return await this.directoryRepository.findOne({
      directoryId: id,
    });
  }

  async update(
    directories: (Partial<DirectoryEntity> &
      Pick<DirectoryEntity, "directoryId">)[],
  ): Promise<DirectoryEntity[]> {
    if (!directories.length) {
      return [];
    }

    const directoryIds = directories.map((directory) => directory.directoryId);

    const currentDirectories = await this.directoryRepository.findAll({
      where: {
        directoryId: { $in: directoryIds },
      },
    });

    currentDirectories.forEach((directory) => {
      const updateData = directories.find(
        (updateDataDirectory) =>
          updateDataDirectory.directoryId === directory.directoryId,
      );
      Object.assign(directory, updateData);
    });

    return await this.directoryRepository.upsertMany(currentDirectories, {
      onConflictFields: ["directoryId"],
      onConflictAction: "merge",
      // onConflictMergeFields: ["name"],
    });
  }

  async delete(
    directories: (Partial<DirectoryEntity> &
      Pick<DirectoryEntity, "directoryId">)[],
  ): Promise<DirectoryEntity[]> {
    if (!directories.length) {
      return [];
    }

    const directoryIds = directories.map((directory) => directory.directoryId);

    const currentDirectories = await this.directoryRepository.findAll({
      where: {
        directoryId: { $in: directoryIds },
      },
    });

    await this.directoryRepository.nativeDelete({
      directoryId: { $in: directoryIds },
    });

    return currentDirectories;
  }

  async upsertMany(
    directories: (Partial<DirectoryEntity> & Pick<DirectoryEntity, "name">)[],
  ): Promise<DirectoryEntity[]> {
    const projectId = this.asyncLocalStorage.getStore()["projectId"];

    directories.forEach((directory) => {
      directory.directoryId = directory.directoryId ?? uuidv4();
      directory.projectId = directory.projectId ?? projectId;
      directory.tags = directory.tags ?? [];
    });

    return await this.directoryRepository.upsertMany(directories, {
      onConflictFields: ["path"],
      onConflictAction: "ignore",
    });
  }

  async getNextItemId(currentItem: DirectoryEntity): Promise<string | null> {
    const nextItem = await this.directoryRepository.findOne(
      this.formWhereCondition({
        path: { $gt: currentItem.path },
      }),
      { orderBy: { path: "asc" } },
    );

    if (nextItem) {
      return nextItem.directoryId;
    }

    const firstItem = await this.directoryRepository.findOne(
      this.formWhereCondition(),
      { orderBy: { path: "asc" } },
    );

    if (firstItem) {
      return firstItem.directoryId;
    }

    return null;
  }

  async getPreviousItemId(
    currentItem: DirectoryEntity,
  ): Promise<string | null> {
    const previousItem = await this.directoryRepository.findOne(
      this.formWhereCondition({
        path: { $lt: currentItem.path },
      }),
      { orderBy: { path: "desc" } },
    );

    if (previousItem) {
      return previousItem.directoryId;
    }

    const lastItem = await this.directoryRepository.findOne(
      this.formWhereCondition(),
      { orderBy: { path: "desc" } },
    );

    if (lastItem) {
      return lastItem.directoryId;
    }

    return null;
  }

  public async getAllSubdirectories(
    directoryIds: string[],
  ): Promise<DirectoryEntity[]> {
    const chosenDirectoriesMap: Map<string, DirectoryEntity> = new Map<
      string,
      DirectoryEntity
    >();

    const selectedDirectories = await this.directoryRepository.findAll({
      where: this.formWhereCondition({
        directoryId: { $in: directoryIds },
      }),
      // orderBy: { path: "desc" },
    });

    const selectedFolderPaths: string[] = [];
    selectedDirectories.forEach((directory) => {
      if (directory.isFolder) {
        selectedFolderPaths.push(directory.path);
        return;
      }
      chosenDirectoriesMap.set(directory.path, directory);
    });

    await Promise.all(
      selectedFolderPaths.map(async (path) => {
        const allFilesInFolder = await this.directoryRepository.findAll({
          where: this.formWhereCondition({
            path: { $like: `${path}%` },
          }),
          // orderBy: { path: "desc" },
        });
        allFilesInFolder.forEach((directory) => {
          chosenDirectoriesMap.set(directory.path, directory);
        });
      }),
    );

    return Array.from(chosenDirectoriesMap.keys()).map((path) =>
      chosenDirectoriesMap.get(path),
    );
  }
}
