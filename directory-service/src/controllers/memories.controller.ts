import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { GenerateMemoriesDto, ViewDto } from "../dtos";
import { MemoriesService, DirectoryService } from "../services";
import { MemoryEntity } from "../entities";

@Controller("memories")
export class MemoriesController {
  constructor(
    private readonly memoriesService: MemoriesService,
    private readonly directoryService: DirectoryService,
  ) {}

  @Get()
  get(
    @Query("limit") limit: number,
    @Query("offset") offset: number,
  ): Promise<MemoryEntity[]> {
    return this.memoriesService.get({ offset, limit });
  }

  @Get("count")
  countNotes(): Promise<number> {
    return this.memoriesService.count();
  }

  @Post()
  createNotes(@Body() params: MemoryEntity[]): Promise<MemoryEntity[]> {
    return this.memoriesService.create(params);
  }

  @Put()
  updateNotes(@Body() params: MemoryEntity[]): Promise<MemoryEntity[]> {
    return this.memoriesService.update(params);
  }

  @Get("view")
  viewNote(@Query("memoryId") memoryId: string): Promise<ViewDto> {
    return this.memoriesService.view(memoryId);
  }

  @Delete()
  deleteNotes(@Body() params: MemoryEntity[]): Promise<MemoryEntity[]> {
    return this.memoriesService.delete(params);
  }

  @Post("generator")
  generate(@Body() params: GenerateMemoriesDto): Promise<{ message: string }> {
    return this.directoryService.generateMemories(params);
  }

  @Get("sources")
  getSources(@Query("memoryId") memoryId: string): Promise<string[]> {
    return this.memoriesService.getSources(memoryId);
  }
}
