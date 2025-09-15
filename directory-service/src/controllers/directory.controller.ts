import { Body, Controller, Get, Post, Put, Query } from "@nestjs/common";
import { DirectoryService } from "../services/directory";
import { DirectoryEntity } from "src/entities";

@Controller("directory")
export class DirectoryController {
  constructor(private readonly directoryService: DirectoryService) {}

  @Get()
  getDirectory(
    @Query("parentId") parentId: string
  ): Promise<Partial<DirectoryEntity[]>> {
    return this.directoryService.get({ parentId });
  }

  @Post("process")
  processDirectory(
    @Body() params: { directoryGuids: string[] }
  ): Promise<{ message: string }> {
    return this.directoryService.process(params.directoryGuids);
  }

  @Post()
  importDirectory(
    @Body() directories: DirectoryEntity[]
  ): Promise<Partial<DirectoryEntity>[]> {
    return this.directoryService.create(directories);
  }

  @Put()
  update(
    @Body() directories: DirectoryEntity[]
  ): Promise<Partial<DirectoryEntity>[]> {
    return this.directoryService.update(directories);
  }
}
