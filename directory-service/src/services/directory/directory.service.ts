import { Inject, Injectable } from "@nestjs/common";
import {
  DirectoryNodeDto,
  GetDirectoryRequestDto,
  GetDirectoryResponseDto,
  ImportDirectoryStructureRequestDto,
  ImportDirectoryStructureResponseDto,
  ProcessMediaMessageRequestDto,
} from "../../dtos";
import { DirectoryEntity } from "../../entities";
import { MediaService } from "../../infrastructure/media/media.service";
import { v4 as uuidv4 } from "uuid";
import { parse } from "path";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/sqlite";

@Injectable()
export class DirectoryService {
  constructor(
    @Inject(MediaService) private readonly mediaClient: MediaService,
    @InjectRepository(DirectoryEntity)
    private readonly directoryRepository: EntityRepository<DirectoryEntity>
  ) {}

  async getDirectory(
    params: GetDirectoryRequestDto
  ): Promise<GetDirectoryResponseDto> {
    const directory: GetDirectoryResponseDto["directory"] = [];

    const directories = await this.directoryRepository.findAll();

    directories
      .filter((directoryElement) => {
        if (params.parentId) {
          return directoryElement.parentId === params.parentId;
        }
        return !directoryElement.parentId;
      })
      .forEach((directoryElement) => {
        let node: DirectoryNodeDto = {
          data: directoryElement,
          leaf: !directoryElement.isFolder,
          children: [],
        };

        directory.push(node);
      });

    return {
      directory,
    };
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

  async processDirectory(
    directoryGuids: string[]
  ): Promise<GetDirectoryResponseDto> {
    const directory: GetDirectoryResponseDto["directory"] = [];
    const directoryToProcess: ProcessMediaMessageRequestDto = {
      directory: [],
    };

    const directories = await this.directoryRepository.findAll();

    console.log(directoryGuids);

    const chosenFiles: DirectoryEntity[] = [];

    directories.forEach((directoryElement) => {
      if (!directoryGuids.includes(directoryElement.directoryId)) {
        return;
      }

      if (directoryElement.isFolder) {
        const filesInFolder = this.scanFolder(
          directories,
          directoryElement.directoryId
        );
        filesInFolder.forEach((file) => {
          chosenFiles.push(file);
        });
      }

      chosenFiles.push(directoryElement);
    });

    if (!chosenFiles.length) {
      return {
        directory,
      };
    }

    chosenFiles.forEach((directoryElement) => {
      if (!directoryElement.isFolder) {
        directoryToProcess.directory.push({
          directoryId: directoryElement.directoryId,
          path: directoryElement.path,
        });
      }

      let node: DirectoryNodeDto = {
        data: directoryElement,
        leaf: !directoryElement.isFolder,
        children: [],
      };

      directory.push(node);
    });

    console.log("processing");

    const mediaServiceResponses: ProcessMediaMessageRequestDto[] = [];

    const processing = directoryToProcess.directory.map(async (file) => {
      const response = await this.mediaClient.processDirectory({
        directory: [file],
      });
      console.log(response);
      mediaServiceResponses.push(response);
      return response;
    });

    Promise.all(processing).then((responses) => {
      console.log("mediaServiceAnswer 2: ", responses);
    });

    return {
      directory,
    };
  }

  async importDirectory(
    directoryStructure: ImportDirectoryStructureRequestDto
  ): Promise<ImportDirectoryStructureResponseDto> {
    console.log("directoryStructure: ", directoryStructure);

    const nodes: {
      [path: string]: DirectoryEntity;
    } = {};

    const existingFolders = await this.directoryRepository.findAll({
      where: {
        isFolder: true,
      },
    });

    const existingFoldersMap: { [path: string]: DirectoryEntity } = {};

    existingFolders.forEach(
      (folder) => (existingFoldersMap[folder.path] = folder)
    );

    for (const directory of directoryStructure.data) {
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
        };
      }
    }

    const newDirectories: DirectoryEntity[] = [];
    Object.keys(nodes).forEach((path) => {
      newDirectories.push(nodes[path]);
    });

    console.log(nodes);

    const savedDirectory = await this.directoryRepository.upsertMany(
      newDirectories,
      { onConflictFields: ["path"], onConflictAction: "ignore" }
    );

    console.log(savedDirectory);

    return {
      message: "ok",
    };
  }
}
