import { Inject, Injectable } from "@nestjs/common";
import { DirectoryEntity } from "../../entities";
import { MediaService } from "../../infrastructure/media/media.service";
import { v4 as uuidv4 } from "uuid";
import { parse } from "path";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository, FilterQuery } from "@mikro-orm/sqlite";
import { AsyncLocalStorage } from "async_hooks";
import { BaseAbstractService } from "../../domain/services";
import { View } from "src/domain/types";

@Injectable()
export class DirectoryService implements BaseAbstractService<DirectoryEntity> {
  constructor(
    @Inject(MediaService) private readonly mediaClient: MediaService,
    @InjectRepository(DirectoryEntity)
    private readonly directoryRepository: EntityRepository<DirectoryEntity>,
    private readonly asyncLocalStorage: AsyncLocalStorage<any>
  ) {}

  async get(params: Partial<DirectoryEntity>): Promise<DirectoryEntity[]> {
    const projectId = this.asyncLocalStorage.getStore()["projectId"];
    console.log("projectId: ", projectId);

    const searchValue = this.asyncLocalStorage.getStore()["searchValue"];
    console.log("searchValue: ", searchValue);

    let whereCondition: FilterQuery<DirectoryEntity> = {
      parentId: params.parentId ?? null,
    };

    if (params.directoryId) {
      whereCondition = {
        directoryId: params.directoryId,
      };
    }

    if (searchValue) {
      whereCondition = {
        path: { $like: `%${searchValue}%` },
        isFolder: false,
      };
    }

    whereCondition.projectId = projectId ?? null;

    return await this.directoryRepository.findAll({
      where: whereCondition,
    });
  }

  async update(
    directories: Partial<DirectoryEntity>[]
  ): Promise<DirectoryEntity[]> {
    const updateData = await this.directoryRepository.findAll({
      where: {
        directoryId: { $in: directories.map((row) => row.directoryId) },
      },
    });

    updateData.forEach((row) => {
      const newValues = directories.find(
        (directory) => directory.directoryId === row.directoryId
      );
      Object.keys(newValues).forEach(
        (property) => (row[property] = newValues[property])
      );
    });

    console.log(updateData);

    return await this.directoryRepository.upsertMany(updateData, {
      onConflictFields: ["directoryId"],
      onConflictAction: "merge",
    });
  }

  private scanFolder(
    directoryStructure: DirectoryEntity[],
    folderId: string
  ): DirectoryEntity[] {
    const result: DirectoryEntity[] = [];

    const children = directoryStructure.filter(
      (directoryNode) => directoryNode.parentId === folderId
    );

    for (const directoryNode of children) {
      if (directoryNode.isFolder) {
        const filesInSubfolder = this.scanFolder(
          directoryStructure,
          directoryNode.directoryId
        );
        for (const subfile of filesInSubfolder) {
          result.push(subfile);
        }
      } else {
        result.push(directoryNode);
      }
    }
    return result;
  }

  async process(directoryGuids: string[]): Promise<{ message: string }> {
    const directories = await this.directoryRepository.findAll({
      // where: {
      //   directoryId: { $in: directoryGuids },
      // },
    });

    console.log(directoryGuids);

    const chosenFiles: DirectoryEntity[] = [];

    directories
      .filter((directoryElement) =>
        directoryGuids.includes(directoryElement.directoryId)
      )
      .forEach((directoryElement) => {
        if (!directoryElement.isFolder) {
          chosenFiles.push(directoryElement);
          return;
        }
        const filesInFolder = this.scanFolder(
          directories,
          directoryElement.directoryId
        );
        filesInFolder.forEach((file) => {
          chosenFiles.push(file);
        });
      });

    if (!chosenFiles.length) {
      return {
        message: "nothing to process",
      };
    }

    console.log("processing");

    const processing = chosenFiles.map(async (file) => {
      const response = await this.mediaClient.processDirectory({
        directory: [{ directoryId: file.directoryId, path: file.path }],
      });
      console.log(response);
      return response;
    });

    Promise.all(processing).then((responses) => {
      console.log("mediaServiceAnswer 2: ", responses);
    });

    return {
      message: "ok",
    };
  }

  async create(
    directories: Partial<DirectoryEntity>[]
  ): Promise<Partial<DirectoryEntity>[]> {
    console.log("newDirectories: ", directories);

    const projectId = this.asyncLocalStorage.getStore()["projectId"];
    console.log("projectId: ", projectId);

    const nodes: {
      [path: string]: DirectoryEntity;
    } = {};

    const existingFolders = await this.directoryRepository.findAll({
      where: {
        isFolder: true,
        projectId,
      },
    });

    const existingFoldersMap: { [path: string]: DirectoryEntity } = {};

    existingFolders.forEach(
      (folder) => (existingFoldersMap[folder.path] = folder)
    );

    for (const directory of directories) {
      for (let charIndex = 0; charIndex < directory.path.length; charIndex++) {
        const char = directory.path[charIndex];

        let pathPart = null;

        const isDelimiterChar = char === "/";
        const isLastChar = charIndex === directory.path.length - 1;

        if (isDelimiterChar) {
          pathPart = directory.path.substring(0, charIndex);
        }
        if (isLastChar) {
          pathPart = directory.path.substring(0, charIndex + 1);
        }

        if (!pathPart || nodes[pathPart]) {
          continue;
        }

        const parsedPath = parse(pathPart);
        const parentId =
          existingFoldersMap[parsedPath.dir]?.directoryId ??
          nodes[parsedPath.dir]?.directoryId ??
          null;

        const directoryId = uuidv4();

        const isFolder =
          !parsedPath.ext?.length || !isLastChar || directory.isFolder || false;

        nodes[pathPart] = {
          directoryId,
          parentId,
          name: parsedPath.base,
          isFolder,
          fileType: parsedPath.ext,
          size: directory.size,
          path: pathPart,
          projectId: projectId,
          tags: null,
        };
      }
    }

    const newDirectories: DirectoryEntity[] = [];
    Object.keys(nodes).forEach((path) => {
      newDirectories.push(nodes[path]);
    });

    console.log(nodes);

    return await this.directoryRepository.upsertMany(newDirectories, {
      onConflictFields: ["path"],
      onConflictAction: "ignore",
    });
  }

  async view(directoryId: string): Promise<View> {
    const directory = await this.directoryRepository.findOne({
      directoryId,
    });

    const view: View = {
      rowIdentifier: directory.directoryId,
      title: directory.name,
      subtitle: directory.path,
      text: null,
      tags: directory.tags,
      image: null,
      next: null,
      previous: null,
      details: null,
    };

    view.next = await this.getNextItem(directory);
    view.previous = await this.getPreviousItem(directory);

    if (!directory.isFolder) {
      view.image = await this.mediaClient.getThumbnails(
        directory.directoryId,
        directory.path
      );

      const media = await this.mediaClient.getInfo(
        directory.directoryId,
        directory.path
      );

      if (media?.info) {
        const info = media.info;
        const size = this.convertSizeInBytes(info.size);
        const durationMinutes = `${String(info.minutes).padStart(2, "0")}`;
        const durationSeconds = `${String(info.seconds).padStart(2, "0")}`;
        const resolution = `${info.width}x${info.height}`;
        view.text = `${size} ${durationMinutes}:${durationSeconds} ${resolution}`;
      }
    }

    return view;
  }

  private convertSizeInBytes(sizeInBytes: number): string {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    }
    if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    }
    if (sizeInBytes < 1024 * 1024 * 1024) {
      return `${(sizeInBytes / 1024 / 1024).toFixed(2)} MB`;
    }
    return `${(sizeInBytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  }

  private async getNextItem(directory: DirectoryEntity): Promise<string> {
    const projectId = this.asyncLocalStorage.getStore()["projectId"];
    const searchValue = this.asyncLocalStorage.getStore()["searchValue"];

    const whereCondition: FilterQuery<DirectoryEntity> = [
      { projectId },
      { path: { $gt: directory.path } },
    ];

    const searchValueCondition: FilterQuery<DirectoryEntity> = [];
    if (searchValue) {
      searchValueCondition.push({ path: { $like: `%${searchValue}%` } });
      searchValueCondition.push({ isFolder: false });
    }

    const nextItem = await this.directoryRepository.findOne(
      {
        $and: [...whereCondition, ...searchValueCondition],
      },
      {
        orderBy: { path: "asc" },
      }
    );

    if (nextItem) {
      return nextItem?.directoryId;
    }

    const firstItem = await this.directoryRepository.findOne(
      {
        $and: [{ projectId }, ...searchValueCondition],
      },
      { orderBy: { path: "asc" } }
    );

    return firstItem?.directoryId;
  }

  private async getPreviousItem(directory: DirectoryEntity): Promise<string> {
    const projectId = this.asyncLocalStorage.getStore()["projectId"];
    const searchValue = this.asyncLocalStorage.getStore()["searchValue"];

    const whereCondition: FilterQuery<DirectoryEntity> = [
      { projectId },
      { path: { $lt: directory.path } },
    ];

    const searchValueCondition: FilterQuery<DirectoryEntity> = [];
    if (searchValue) {
      searchValueCondition.push({ path: { $like: `%${searchValue}%` } });
      searchValueCondition.push({ isFolder: false });
    }

    const previousItem = await this.directoryRepository.findOne(
      { $and: [...whereCondition, ...searchValueCondition] },
      { orderBy: { path: "desc" } }
    );

    if (previousItem) {
      return previousItem?.directoryId;
    }

    const lastItem = await this.directoryRepository.findOne(
      {
        $and: [{ projectId }, ...searchValueCondition],
      },
      { orderBy: { path: "desc" } }
    );

    return lastItem?.directoryId;
  }
}
