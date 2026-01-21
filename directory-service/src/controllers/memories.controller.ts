import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { GenerateMemoriesDto } from "../dtos";
import { MemoriesService, DirectoryService } from "../services";
import { MemoryEntity } from "../entities";

@Controller("memories")
export class MemoriesController {
  constructor(
    private readonly memoriesService: MemoriesService,
    private readonly directoryService: DirectoryService,
  ) {}

  @Post("generator")
  generate(@Body() params: GenerateMemoriesDto): Promise<{ message: string }> {
    return this.directoryService.generateMemories(params);
  }

  @Get("sources")
  getSources(@Query("memoryId") memoryId: string): Promise<string[]> {
    return this.memoriesService.getSources(memoryId);
  }

  @Get()
  get(
    @Query("limit") limit: number,
    @Query("offset") offset: number,
  ): Promise<MemoryEntity[]> {
    return this.memoriesService.get({ offset, limit });
  }
}
