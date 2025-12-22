import { Inject, Injectable } from "@nestjs/common";
import { GenerateMemoriesDto } from "../../dtos";
import { MediaService } from "../../infrastructure/media/media.service";

@Injectable()
export class MemoriesService {
  constructor(
    @Inject(MediaService) private readonly mediaClient: MediaService
  ) {}

  async generate(params?: GenerateMemoriesDto): Promise<{ message: string }> {
    await this.mediaClient.generateMemories(params);
    return { message: "ok" };
  }

  async get(): Promise<string[]> {
    return await this.mediaClient.getMemorySources();
  }
}
