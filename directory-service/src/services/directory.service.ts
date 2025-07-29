import { Inject, Injectable } from "@nestjs/common";
import {
  DirectoryNodeDto,
  GetDirectoryRequestDto,
  GetDirectoryResponseDto,
} from "../dtos";
import { DirectoryEntity } from "../entities";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

const dummyDirectory: DirectoryEntity[] = [
  {
    directoryId: "a8dde4ff-0d4d-4996-a18b-75614bf67e93",
    parentId: null,
    name: "Root Folder",
    isFolder: true,
    fileType: null,
    size: 4096,
  },
  {
    directoryId: "b5c2e8f1-3a7b-492e-9c45-d8e3f9a12b41",
    parentId: "a8dde4ff-0d4d-4996-a18b-75614bf67e93",
    name: "Documents",
    isFolder: true,
    fileType: null,
    size: 8192,
  },
  {
    directoryId: "c3d9f7a2-1e4b-48f9-8c6d-2b5e1f3a9c74",
    parentId: "a8dde4ff-0d4d-4996-a18b-75614bf67e93",
    name: "Images",
    isFolder: true,
    fileType: null,
    size: 12288,
  },
  {
    directoryId: "d7e4f8a9-2b6c-431d-9e3f-5a1b8c2d4e7f",
    parentId: "b5c2e8f1-3a7b-492e-9c45-d8e3f9a12b41",
    name: "Work",
    isFolder: true,
    fileType: null,
    size: 4096,
  },
  {
    directoryId: "e2f9c6d1-4a8b-4973-8c5e-1d7f3a9b2e4c",
    parentId: "b5c2e8f1-3a7b-492e-9c45-d8e3f9a12b41",
    name: "Personal",
    isFolder: true,
    fileType: null,
    size: 6144,
  },
  {
    directoryId: "f4a7e9b2-5d3c-4861-9f8e-2b6c1d3a5e4f",
    parentId: "c3d9f7a2-1e4b-48f9-8c6d-2b5e1f3a9c74",
    name: "Vacation",
    isFolder: true,
    fileType: null,
    size: 20480,
  },
  {
    directoryId: "1a2b3c4d-5e6f-7890-1234-5678f9a0b1c2",
    parentId: "d7e4f8a9-2b6c-431d-9e3f-5a1b8c2d4e7f",
    name: "Project X",
    isFolder: false,
    fileType: "docx",
    size: 245760,
  },
  {
    directoryId: "3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8g",
    parentId: "e2f9c6d1-4a8b-4973-8c5e-1d7f3a9b2e4c",
    name: "Resume.pdf",
    isFolder: false,
    fileType: "pdf",
    size: 512000,
  },
  {
    directoryId: "5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b",
    parentId: "f4a7e9b2-5d3c-4861-9f8e-2b6c1d3a5e4f",
    name: "Beach.jpg",
    isFolder: false,
    fileType: "jpg",
    size: 3145728,
  },
  {
    directoryId: "7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d",
    parentId: null,
    name: "Another Root Folder",
    isFolder: true,
    fileType: null,
    size: 4096,
  },
  {
    directoryId: "9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d",
    parentId: "c3d9f7a2-1e4b-48f9-8c6d-2b5e1f3a9c74",
    name: "Screenshot.png",
    isFolder: false,
    fileType: "png",
    size: 1048576,
  },
];

@Injectable()
export class DirectoryService {
  constructor(@Inject("MEDIA_CLIENT") private readonly client: ClientProxy) {}

  getDirectory(params: GetDirectoryRequestDto): GetDirectoryResponseDto {
    const directory: GetDirectoryResponseDto["directory"] = [];

    dummyDirectory
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

  async processDirectory(
    directoryGuids: string[]
  ): Promise<GetDirectoryResponseDto> {
    const directory: GetDirectoryResponseDto["directory"] = [];

    dummyDirectory.forEach((directoryElement) => {
      if (!directoryGuids.includes(directoryElement.directoryId)) {
        return;
      }

      let node: DirectoryNodeDto = {
        data: directoryElement,
        leaf: !directoryElement.isFolder,
        children: [],
      };

      directory.push(node);
    });

    console.log(directory);

    const mediaServiceAnswer = await firstValueFrom(
      this.client.send("media_queue", {
        directoryGuids,
        random: Math.random(),
      })
    );

    console.log("mediaServiceAnswer: ", mediaServiceAnswer);

    return {
      directory,
    };
  }
}
