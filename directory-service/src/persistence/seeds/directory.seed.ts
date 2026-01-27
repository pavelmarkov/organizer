import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { DirectoryEntity, ProjectEntity } from "../../entities";

export class DirectorySeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const project = await em.findOne(ProjectEntity, {
      name: "Demo Project",
    });

    em.upsertMany(
      DirectoryEntity,
      [
        {
          directoryId: "a8dde4ff-0d4d-4996-a18b-75614bf67e93",
          parentId: null,
          name: "Root Folder",
          isFolder: true,
          fileType: null,
          size: 4096,
          path: "Root Folder",
          projectId: project,
        },
        {
          directoryId: "b5c2e8f1-3a7b-492e-9c45-d8e3f9a12b41",
          parentId: "a8dde4ff-0d4d-4996-a18b-75614bf67e93",
          name: "Documents",
          isFolder: true,
          fileType: null,
          size: 8192,
          path: "Root Folder/Documents",
          projectId: project,
        },
        {
          directoryId: "c3d9f7a2-1e4b-48f9-8c6d-2b5e1f3a9c74",
          parentId: "a8dde4ff-0d4d-4996-a18b-75614bf67e93",
          name: "Images",
          isFolder: true,
          fileType: null,
          size: 12288,
          path: "Root Folder/Images",
          projectId: project,
        },
        {
          directoryId: "d7e4f8a9-2b6c-431d-9e3f-5a1b8c2d4e7f",
          parentId: "b5c2e8f1-3a7b-492e-9c45-d8e3f9a12b41",
          name: "Work",
          isFolder: true,
          fileType: null,
          size: 4096,
          path: "Root Folder/Documents/Work",
          projectId: project,
        },
        {
          directoryId: "e2f9c6d1-4a8b-4973-8c5e-1d7f3a9b2e4c",
          parentId: "b5c2e8f1-3a7b-492e-9c45-d8e3f9a12b41",
          name: "Personal",
          isFolder: true,
          fileType: null,
          size: 6144,
          path: "Root Folder/Documents/Personal",
          projectId: project,
        },
        {
          directoryId: "f4a7e9b2-5d3c-4861-9f8e-2b6c1d3a5e4f",
          parentId: "c3d9f7a2-1e4b-48f9-8c6d-2b5e1f3a9c74",
          name: "Vacation",
          isFolder: true,
          fileType: null,
          size: 20480,
          path: "Root Folder/Images/Vacation",
          projectId: project,
        },
        {
          directoryId: "1a2b3c4d-5e6f-7890-1234-5678f9a0b1c2",
          parentId: "d7e4f8a9-2b6c-431d-9e3f-5a1b8c2d4e7f",
          name: "Project X",
          isFolder: false,
          fileType: "docx",
          size: 245760,
          path: "Root Folder/Documents/Work/Project X.docx",
          projectId: project,
        },
        {
          directoryId: "3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8g",
          parentId: "e2f9c6d1-4a8b-4973-8c5e-1d7f3a9b2e4c",
          name: "Resume.pdf",
          isFolder: false,
          fileType: "pdf",
          size: 512000,
          path: "Root Folder/Documents/Personal/Resume.pdf",
          projectId: project,
        },
        {
          directoryId: "5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b",
          parentId: "f4a7e9b2-5d3c-4861-9f8e-2b6c1d3a5e4f",
          name: "Beach.jpg",
          isFolder: false,
          fileType: "jpg",
          size: 3145728,
          path: "Root Folder/Images/Vacation/Beach.jpg",
          projectId: project,
        },
        {
          directoryId: "7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d",
          parentId: null,
          name: "Another Root Folder",
          isFolder: true,
          fileType: null,
          size: 4096,
          path: "",
          projectId: project,
        },
        {
          directoryId: "9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d",
          parentId: "c3d9f7a2-1e4b-48f9-8c6d-2b5e1f3a9c74",
          name: "Screenshot.png",
          isFolder: false,
          fileType: "png",
          size: 1048576,
          path: "Root Folder/Images/Screenshot.png",
          projectId: project,
        },
      ],
      {
        onConflictFields: ["directoryId"],
        onConflictAction: "merge",
        onConflictMergeFields: ["projectId"],
      },
    );

    const allDirectories = await em.findAll(DirectoryEntity);

    const allDirectoriesMap: Map<string, DirectoryEntity> = new Map<
      string,
      DirectoryEntity
    >();

    allDirectories.forEach((directory) => {
      allDirectoriesMap.set(directory.directoryId, directory);
    });

    allDirectories.forEach(async (directory) => {
      let path = `/${directory.name}`;
      let parentId = directory.parentId;

      while (parentId) {
        const parentDirectory = allDirectoriesMap.get(parentId);
        path = `/${parentDirectory.name}${path}`;
        parentId = parentDirectory.parentId;
      }

      allDirectoriesMap.set(directory.directoryId, {
        ...directory,
        path: path,
      });
    });

    em.upsertMany(DirectoryEntity, Array.from(allDirectoriesMap.values()), {
      onConflictFields: ["directoryId"],
      onConflictAction: "merge",
      onConflictMergeFields: ["path"],
    });
  }
}
