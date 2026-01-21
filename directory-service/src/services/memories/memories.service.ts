import { Inject, Injectable } from "@nestjs/common";
import { GenerateMemoriesDto } from "../../dtos";
import { MediaService } from "../../infrastructure/media/media.service";
import { MemoriesRepository } from "../../persistence/repositories";
import { MemoryEntity } from "../../entities";

@Injectable()
export class MemoriesService {
  constructor(
    @Inject(MediaService) private readonly mediaClient: MediaService,
    private readonly memoriesRepository: MemoriesRepository,
  ) {}

  async generate(params?: GenerateMemoriesDto): Promise<{ message: string }> {
    await this.mediaClient.generateMemories(params);
    return { message: "ok" };
  }

  async getSources(memoryId: string): Promise<string[]> {
    return await this.mediaClient.getMemorySources(memoryId);
  }

  async get(pagination?: {
    offset: number;
    limit: number;
  }): Promise<MemoryEntity[]> {
    return await this.memoriesRepository.findAll({
      pagination,
    });
  }
}
