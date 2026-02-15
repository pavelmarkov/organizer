import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import {
  GenerateMemoriesDto,
  GenerateMemoriesRequestDto,
  MemorySourceDto,
  ViewDto,
} from "../dtos";
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
  countMemories(): Promise<number> {
    return this.memoriesService.count();
  }

  @Post()
  createMemories(@Body() params: MemoryEntity[]): Promise<MemoryEntity[]> {
    return this.memoriesService.create(params);
  }

  @Put()
  updateMemories(@Body() params: MemoryEntity[]): Promise<MemoryEntity[]> {
    return this.memoriesService.update(params);
  }

  @Get("view")
  viewNote(@Query("memoryId") memoryId: string): Promise<ViewDto> {
    return this.memoriesService.view(memoryId);
  }

  @Delete()
  deleteMemories(@Body() params: MemoryEntity[]): Promise<MemoryEntity[]> {
    return this.memoriesService.delete(params);
  }

  @Post("generator")
  generate(
    @Body() params: GenerateMemoriesRequestDto,
  ): Promise<{ message: string }> {
    return this.directoryService.generateMemories(params);
  }

  @Get("sources")
  getSources(@Query("memoryId") memoryId: string): Promise<MemorySourceDto[]> {
    return this.memoriesService.getSources(memoryId);
  }

  @Patch("sources")
  updateSources(
    @Body() params: (Pick<MemorySourceDto, "id"> & Partial<MemorySourceDto>)[],
  ): Promise<MemorySourceDto[]> {
    return this.memoriesService.updateSources(params);
  }

  @Delete("sources")
  deleteSources(
    @Body() params: (Pick<MemorySourceDto, "id"> & Partial<MemorySourceDto>)[],
  ): Promise<MemorySourceDto[]> {
    return this.memoriesService.deleteSources(params);
  }
}
