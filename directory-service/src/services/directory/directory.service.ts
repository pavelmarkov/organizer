import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { DirectoryEntity, MemoryEntity } from "../../entities";
import { MediaService } from "../../infrastructure/media/media.service";
import { v4 as uuidv4 } from "uuid";
import { parse } from "path";
import { BaseAbstractService } from "../../domain/services";
import { MediaInfo, View } from "../../domain/types";
import { DirectoryRepository } from "./directory.repository";
import { convertSizeInBytes } from "./utils/convert-size-in-bytes";
import { AsyncLocalStorage } from "async_hooks";
import {
  GenerateMemoriesDto,
  GenerateMemoriesRequestDto,
  TimeIntervalDto,
} from "../../dtos";
import { MemoriesRepository } from "../../persistence/repositories";
import { FileStateEnum } from "src/domain/enums";

@Injectable()
export class DirectoryService implements BaseAbstractService<DirectoryEntity> {
  constructor(
    @Inject(MediaService) private readonly mediaClient: MediaService,
    private readonly directoryRepository: DirectoryRepository,
    private readonly asyncLocalStorage: AsyncLocalStorage<any>,
    private readonly memoriesRepository: MemoriesRepository,
  ) {}

  async get(
    params: Partial<DirectoryEntity>,
    pagination?: { offset: number; limit: number },
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
      Pick<DirectoryEntity, "directoryId">)[],
  ): Promise<DirectoryEntity[]> {
    return this.directoryRepository.update(directories);
  }

  async delete(items: Partial<DirectoryEntity[]>): Promise<DirectoryEntity[]> {
    return await this.directoryRepository.delete(items);
  }

  async process(directoryGuids: string[]): Promise<{ message: string }> {
    const selectedDirectories =
      await this.directoryRepository.getAllSubdirectories(directoryGuids);

    const chosenFiles = selectedDirectories.filter(
      (directory) => !directory.isFolder,
    );

    if (!chosenFiles.length) {
      return {
        message: "nothing to process",
      };
    }

    console.log("processing");

    const processing = chosenFiles.map(async (file) => {
      const response = await this.mediaClient.processDirectory({
        directories: [{ directoryId: file.directoryId, path: file.path }],
      });
      // console.dir(response, { depth: null });

      file.info = new MediaInfo();

      if (!response?.directories?.length) {
        const error = "File wan't processed";
        file.info.errors.push(error);
      } else {
        const processingResult = response.directories[0];
        file.info = processingResult.info;
        file.info.errors = processingResult.errors;
      }

      file.state = FileStateEnum.PROCESSED;

      if (file.info.errors.length) {
        file.state = FileStateEnum.ERROR;
      }

      const updatedFileData = await this.directoryRepository.update([file]);

      console.dir(updatedFileData[0].info, { depth: null });

      return updatedFileData;
    });

    Promise.all(processing);

    return {
      message: "ok",
    };
  }

  async generateMemories(
    params: GenerateMemoriesRequestDto,
  ): Promise<{ message: string }> {
    if (!params.directories?.length) {
      return { message: "nothing to process" };
    }

    console.dir(params);

    const timeIntervalsMap = new Map<string, TimeIntervalDto>();
    const directoryGuids: string[] = [];
    const memory: MemoryEntity[] = [];

    params.directories.forEach(({ directoryId, interval }) => {
      directoryGuids.push(directoryId);
      if (interval) {
        timeIntervalsMap.set(directoryId, interval);
      }
    });

    const chosenDirectories =
      await this.directoryRepository.getAllSubdirectories(directoryGuids);

    const files = chosenDirectories.filter((directory) => !directory.isFolder);

    const directories = files.map((file) => {
      return {
        directoryId: file.directoryId,
        path: file.path,
        interval: timeIntervalsMap.get(file.directoryId),
      };
    });

    if (params.memoryGuid) {
      const existingMemory = await this.memoriesRepository.findOne(
        params.memoryGuid,
      );
      memory.push(existingMemory);
    } else {
      const newMemory = await this.memoriesRepository.upsertMany([
        {
          name: uuidv4(),
          description: "",
        },
      ]);
      memory.push(newMemory[0]);
    }

    const memoryId = memory[0]?.id;

    if (!memoryId) {
      return new InternalServerErrorException("Memory is not defined");
    }

    console.log({
      directories,
      memoryGuid: memoryId,
    });

    this.mediaClient.generateMemories({
      directories,
      memoryGuid: memoryId,
    });

    return { message: "ok" };
  }

  async create(
    directories: Partial<DirectoryEntity>[],
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
      (folder) => (existingFoldersMap[folder.path] = folder),
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

    if (!directory) {
      throw new NotFoundException("Directory not found");
    }

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
      attachments: [],
    };

    view.next = await this.directoryRepository.getNextItemId(directory);
    view.previous = await this.directoryRepository.getPreviousItemId(directory);

    if (!directory.isFolder) {
      const media = directory.info?.durationInSeconds
        ? {
            info: {
              duration_in_seconds: directory.info.durationInSeconds,
              minutes: directory.info.minutes,
              seconds: directory.info.seconds,
              width: directory.info.width,
              height: directory.info.height,
              codec_name: directory.info.codecName,
              size: directory.info.size,
            },
          }
        : await this.mediaClient.getInfo(directory.directoryId, directory.path);

      if (!media?.info) {
        return view;
      }

      view.image = await this.mediaClient.getThumbnails(
        directory.directoryId,
        directory.path,
      );

      const info = media.info;
      const size = convertSizeInBytes(info.size);
      const durationMinutes = `${String(info.minutes).padStart(2, "0")}`;
      const durationSeconds = `${String(info.seconds).padStart(2, "0")}`;
      const resolution = `${info.width}x${info.height}`;
      view.text = `${size} ${durationMinutes}:${durationSeconds} ${resolution}`;
      view.attachments.push({
        source: this.mediaClient.getStreamUrl(directory.path),
      });
    }

    return view;
  }
}
