import { Inject, Injectable } from "@nestjs/common";
import { GenerateMemoriesDto } from "../../dtos";
import { MediaService } from "../../infrastructure/media/media.service";
import { MemoriesRepository } from "../../persistence/repositories";
import { MemoryEntity } from "../../entities";
import { View } from "../../domain/types";

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

  async count(filter?: Partial<MemoryEntity>): Promise<number> {
    return await this.memoriesRepository.count(filter);
  }

  async create(memories: Partial<MemoryEntity[]>): Promise<MemoryEntity[]> {
    return await this.memoriesRepository.upsertMany(memories);
  }

  async update(memories: Partial<MemoryEntity[]>): Promise<MemoryEntity[]> {
    return await this.memoriesRepository.update(memories);
  }

  async delete(memories: Partial<MemoryEntity[]>): Promise<MemoryEntity[]> {
    const messages = await this.mediaClient.removeMemory(memories[0].id);
    console.log(messages);
    return await this.memoriesRepository.delete(memories);
  }

  async view(memoryId: string): Promise<View> {
    const memory = await this.memoriesRepository.findOne(memoryId);

    const view: View = {
      rowIdentifier: memory.id,
      title: memory.name,
      subtitle: null,
      text: memory.description,
      tags: [],
      image: null,
      next: null,
      previous: null,
      details: null,
    };

    view.next = await this.memoriesRepository.getNextItemId(memory);

    view.previous = await this.memoriesRepository.getPreviousItemId(memory);

    return view;
  }
}
