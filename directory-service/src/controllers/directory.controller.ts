import { Controller, Get } from "@nestjs/common";
import { GetDirectoryResponseDto } from "../dtos";
import { DirectoryService } from "../services";

@Controller()
export class DirectoryController {
  constructor(private readonly directoryService: DirectoryService) {}

  @Get("directory")
  getDirectory(): GetDirectoryResponseDto {
    return this.directoryService.getDirectory();
  }
}
