import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import {
  GetDirectoryResponseDto,
  ImportDirectoryStructureRequestDto,
  ImportDirectoryStructureResponseDto,
} from "../dtos";
import { DirectoryService } from "../services/directory";

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
  ): Promise<GetDirectoryResponseDto> {
    return this.directoryService.processDirectory(params.directoryGuids);
  }

  @Post("directory/import")
  importDirectory(
    @Body() directoryStructure: ImportDirectoryStructureRequestDto
  ): Promise<ImportDirectoryStructureResponseDto> {
    return this.directoryService.importDirectory(directoryStructure);
  }
}
