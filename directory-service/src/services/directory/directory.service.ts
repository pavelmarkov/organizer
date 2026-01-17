import { Inject, Injectable } from "@nestjs/common";
import { DirectoryEntity } from "../../entities";
import { MediaService } from "../../infrastructure/media/media.service";
import { v4 as uuidv4 } from "uuid";
import { parse } from "path";
import { BaseAbstractService } from "../../domain/services";
import { View } from "../../domain/types";
import { DirectoryRepository } from "./directory.repository";
import { convertSizeInBytes } from "./utils/convert-size-in-bytes";
import { AsyncLocalStorage } from "async_hooks";
import { GenerateMemoriesDto } from "../../dtos";
import { MemoriesRepository } from "../../persistence/repositories";

@Injectable()
export class DirectoryService implements BaseAbstractService<DirectoryEntity> {
  constructor(
    @Inject(MediaService) private readonly mediaClient: MediaService,
    private readonly directoryRepository: DirectoryRepository,
    private readonly asyncLocalStorage: AsyncLocalStorage<any>,
    private readonly memoriesRepository: MemoriesRepository
  ) {}

  async get(
    params: Partial<DirectoryEntity>,
    pagination?: { offset: number; limit: number }
  ): Promise<DirectoryEntity[]> {
    const searchValue = this.asyncLocalStorage.getStore()["searchValue"];

    let whereCondition: Partial<DirectoryEntity> = {};
    let paginationValues = null;

    if (!searchValue) {
      whereCondition.parentId = params.parentId ?? null;
    }

    if (searchValue || "parentId" in whereCondition) {
      paginationValues = pagination;
    }

    if (params.directoryId) {
      whereCondition = {
        directoryId: params.directoryId,
      };
    }

    return await this.directoryRepository.findAll({
      filter: whereCondition,
      pagination: paginationValues,
      order: { path: "asc" },
    });
  }

  async count(filter?: Partial<DirectoryEntity>): Promise<number> {
    return await this.directoryRepository.count(filter);
  }

  async update(
    directories: (Partial<DirectoryEntity> &
      Pick<DirectoryEntity, "directoryId">)[]
  ): Promise<DirectoryEntity[]> {
    return this.directoryRepository.update(directories);
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

  private async getAllFilesInFolder(params: {
    directoryGuids: string[];
  }): Promise<DirectoryEntity[]> {
    const { directoryGuids } = params;

    const directories = await this.directoryRepository.findAll({});

    const chosenFiles: DirectoryEntity[] = [];

    const includedFileGuidsSet = new Set<string>();

    directories
      .filter((directoryElement) =>
        directoryGuids.includes(directoryElement.directoryId)
      )
      .forEach((directoryElement) => {
        if (includedFileGuidsSet.has(directoryElement.directoryId)) {
          return;
        }
        if (!directoryElement.isFolder) {
          chosenFiles.push(directoryElement);
          includedFileGuidsSet.add(directoryElement.directoryId);
          return;
        }
        const filesInFolder = this.scanFolder(
          directories,
          directoryElement.directoryId
        );
        filesInFolder.forEach((file) => {
          chosenFiles.push(file);
          includedFileGuidsSet.add(file.directoryId);
        });
      });

    return chosenFiles;
  }

  async process(directoryGuids: string[]): Promise<{ message: string }> {
    const chosenFiles: DirectoryEntity[] = await this.getAllFilesInFolder({
      directoryGuids,
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

  async generateMemories(
    params?: GenerateMemoriesDto
  ): Promise<{ message: string }> {
    const files = await this.getAllFilesInFolder(params);

    const directoryGuids = files.map((file) => file.directoryId);
    const paths = files.map((file) => file.path);

    const memory = await this.memoriesRepository.upsertMany([
      {
        name: uuidv4(),
        description: "",
      },
    ]);

    await this.mediaClient.generateMemories({
      directoryGuids,
      memoryGuid: memory[0].id,
      paths,
    });

    return { message: "ok" };
  }

  async create(
    directories: Partial<DirectoryEntity>[]
  ): Promise<Partial<DirectoryEntity>[]> {
    const nodes: {
      [path: string]: DirectoryEntity;
    } = {};

    const existingFolders = await this.directoryRepository.findAll({
      filter: {
        isFolder: true,
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
          projectId: null,
          tags: null,
        };
      }
    }

    const newDirectories: DirectoryEntity[] = [];
    Object.keys(nodes).forEach((path) => {
      newDirectories.push(nodes[path]);
    });

    console.log(nodes);

    return await this.directoryRepository.upsertMany(newDirectories);
  }

  async view(directoryId: string): Promise<View> {
    const directory = await this.directoryRepository.findOne(directoryId);

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

    view.next = await this.directoryRepository.getNextItemId(directory);
    view.previous = await this.directoryRepository.getPreviousItemId(directory);

    if (!directory.isFolder) {
      const media = await this.mediaClient.getInfo(
        directory.directoryId,
        directory.path
      );

      if (!media?.info) {
        return view;
      }

      view.image = await this.mediaClient.getThumbnails(
        directory.directoryId,
        directory.path
      );

      const info = media.info;
      const size = convertSizeInBytes(info.size);
      const durationMinutes = `${String(info.minutes).padStart(2, "0")}`;
      const durationSeconds = `${String(info.seconds).padStart(2, "0")}`;
      const resolution = `${info.width}x${info.height}`;
      view.text = `${size} ${durationMinutes}:${durationSeconds} ${resolution}`;
    }

    return view;
  }
}
