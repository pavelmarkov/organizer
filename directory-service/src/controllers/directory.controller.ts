import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import {
  GetDirectoryResponseDto,
  ImportDirectoryStructureRequestDto,
  ImportDirectoryStructureResponseDto,
} from "../dtos";
import { DirectoryService } from "../services/directory";

@Controller("directory")
export class DirectoryController {
  constructor(private readonly directoryService: DirectoryService) {}

  @Get()
  getDirectory(
    @Query("parentId") parentId: string
  ): Promise<GetDirectoryResponseDto> {
    return this.directoryService.getDirectory({ parentId });
  }

  @Post("process")
  processDirectory(
    @Body() params: { directoryGuids: string[] }
  ): Promise<GetDirectoryResponseDto> {
    return this.directoryService.processDirectory(params.directoryGuids);
  }

  @Post("import")
  importDirectory(
    @Body() directoryStructure: ImportDirectoryStructureRequestDto
  ): Promise<ImportDirectoryStructureResponseDto> {
    return this.directoryService.importDirectory(directoryStructure);
  }
}
