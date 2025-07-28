import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { GetDirectoryResponseDto } from "../dtos";
import { DirectoryService } from "../services";

@Controller()
export class DirectoryController {
  constructor(private readonly directoryService: DirectoryService) {}

  @Get("directory")
  getDirectory(@Query("parentId") parentId: string): GetDirectoryResponseDto {
    return this.directoryService.getDirectory({ parentId });
  }

  @Post("directory/process")
  processDirectory(
    @Body() params: { directoryGuids: string[] }
  ): GetDirectoryResponseDto {
    return this.directoryService.processDirectory(params.directoryGuids);
  }
}
