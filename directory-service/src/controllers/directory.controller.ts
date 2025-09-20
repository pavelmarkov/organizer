import { Body, Controller, Get, Post, Put, Query } from "@nestjs/common";
import { DirectoryService } from "../services/directory";
import { DirectoryEntity } from "src/entities";
import { ViewDto } from "../dtos";

@Controller("directory")
export class DirectoryController {
  constructor(private readonly directoryService: DirectoryService) {}

  @Get()
  getDirectory(
    @Query("directoryId") directoryId: string,
    @Query("parentId") parentId: string
  ): Promise<Partial<DirectoryEntity[]>> {
    return this.directoryService.get({ parentId, directoryId });
  }

  @Get("view")
  viewDirectory(@Query("directoryId") directoryId: string): Promise<ViewDto> {
    return this.directoryService.view(directoryId);
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
