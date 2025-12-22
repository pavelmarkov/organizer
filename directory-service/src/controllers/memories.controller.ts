import { Body, Controller, Get, Post } from "@nestjs/common";
import { GenerateMemoriesDto } from "../dtos";
import { MemoriesService, DirectoryService } from "../services";

@Controller("memories")
export class MemoriesController {
  constructor(
    private readonly memoriesService: MemoriesService,
    private readonly directoryService: DirectoryService
  ) {}

  @Post("generator")
  generate(@Body() params: GenerateMemoriesDto): Promise<{ message: string }> {
    return this.directoryService.generateMemories(params);
  }

  @Get()
  get(): Promise<string[]> {
    return this.memoriesService.get();
  }
}
