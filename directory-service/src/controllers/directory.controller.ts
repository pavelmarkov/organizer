import { Controller, Get, Query } from "@nestjs/common";
import { GetDirectoryResponseDto } from "../dtos";
import { DirectoryService } from "../services";

@Controller()
export class DirectoryController {
  constructor(private readonly directoryService: DirectoryService) {}

  @Get("directory")
  getDirectory(@Query("parentId") parentId: number): GetDirectoryResponseDto {
    return this.directoryService.getDirectory({ parentId });
  }
}
