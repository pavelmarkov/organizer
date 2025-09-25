import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { MediaInfoDto, ProcessMediaMessageRequestDto } from "../../dtos";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { MEDIA_SERVICE_CLIENT } from "../../consts/infrastructure";
import { ConfigService } from "../../shared/config";

@Injectable()
export class MediaService implements OnModuleInit {
  httpUrl: string = null;

  constructor(
    @Inject(MEDIA_SERVICE_CLIENT) private readonly client: ClientProxy,
    private readonly configService: ConfigService
  ) {}

  async onModuleInit() {
    const config = await this.configService.getConfig();
    this.httpUrl = `http://${config.mediaServiceHttp.host}:${config.mediaServiceHttp.port}`;
  }

  async processDirectory(
    params: ProcessMediaMessageRequestDto
  ): Promise<ProcessMediaMessageRequestDto> {
    try {
      console.log("params to media service 1: ", params);
      const mediaServiceAnswer = await lastValueFrom(
        this.client.send("media_queue", params)
      );

      console.log("mediaServiceAnswer 1: ", mediaServiceAnswer);

      return mediaServiceAnswer.data;
    } catch (error) {
      console.log(error);
      return { directory: [] };
    }
  }

  async getThumbnails(directoryId: string, path: string): Promise<string> {
    const url = new URL(`${this.httpUrl}/preview`);

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
      console.error("cannot get thumbnails data");
      return null;
    }

    return null;
  }

  async getInfo(
    directoryId: string,
    path: string
  ): Promise<{
    error?: boolean;
    info?: MediaInfoDto;
  }> {
    const url = new URL(`${this.httpUrl}/info`);

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
}
