import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import {
  GenerateMemoriesDto,
  GetMemorySourcesDto,
  MediaInfoDto,
  ProcessMediaMessageRequestDto,
} from "../../dtos";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import {
  MEDIA_SERVICE_CLIENT,
  MEMORIES_SERVICE_CLIENT,
} from "../../consts/infrastructure";
import { ConfigService } from "../../shared/config";
import { mapMemorySources } from "./mappers/map-memory-sources-response";

@Injectable()
export class MediaService implements OnModuleInit {
  httpUrl: string = null;

  constructor(
    @Inject(MEDIA_SERVICE_CLIENT) private readonly mediaClient: ClientProxy,
    @Inject(MEMORIES_SERVICE_CLIENT)
    private readonly memoriesClient: ClientProxy,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const config = await this.configService.getConfig();
    this.httpUrl = `http://${config.mediaServiceHttp.host}:${config.mediaServiceHttp.port}/api/v1`;
  }

  async processDirectory(
    params: ProcessMediaMessageRequestDto,
  ): Promise<ProcessMediaMessageRequestDto> {
    try {
      console.log("params to media service 1: ", params);
      const mediaServiceAnswer = await lastValueFrom(
        this.mediaClient.send("media_queue", params),
      );

      console.log("mediaServiceAnswer 1: ", mediaServiceAnswer);

      return mediaServiceAnswer.data;
    } catch (error) {
      console.log(error);
      return { directory: [] };
    }
  }

  async getThumbnails(directoryId: string, path: string): Promise<string> {
    const url = new URL(`${this.httpUrl}/media/preview`);

    url.searchParams.set("path_to_file", path);
    url.searchParams.set("directory_id", directoryId);

    try {
      const imageData = await fetch(url);
      if (imageData.ok) {
        const blob = await imageData.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const content = Buffer.from(arrayBuffer);
        return content.toString("base64");
      }
    } catch (error) {
      console.log(error);
      console.error("cannot get thumbnails data");
      return null;
    }

    return null;
  }

  async getInfo(
    directoryId: string,
    path: string,
  ): Promise<{
    error?: boolean;
    info?: MediaInfoDto;
  }> {
    const url = new URL(`${this.httpUrl}/media/info`);

    url.searchParams.set("path_to_file", path);
    url.searchParams.set("directory_id", directoryId);

    try {
      const imageData = await fetch(url);
      if (imageData.ok) {
        return imageData.json();
      }
    } catch (error) {
      console.error("cannot get media info");
      return null;
    }

    return null;
  }

  async generateMemories(
    params: GenerateMemoriesDto,
  ): Promise<{ message: string }> {
    const memoriesServiceAnswer = await lastValueFrom(
      this.memoriesClient.send("memories_queue", params),
    );
    console.log("memoriesServiceAnswer: ", memoriesServiceAnswer);
    return { message: "ok" };
  }

  async getMemorySources(memoryId: string): Promise<GetMemorySourcesDto[]> {
    const url = new URL(`${this.httpUrl}/clips`);

    url.searchParams.set("memory_id", memoryId);

    const sources = await fetch(url);

    const result = await sources.json();

    if (Array.isArray(result)) {
      return mapMemorySources(result);
    }

    return [];
  }

  async removeMemory(memoryId: string): Promise<string[]> {
    const url = new URL(`${this.httpUrl}/clips`);

    url.searchParams.set("memory_id", memoryId);

    const messages = await fetch(url, { method: "DELETE" });

    const result = await messages.json();

    if (Array.isArray(result)) {
      return result;
    }

    return [];
  }
}
