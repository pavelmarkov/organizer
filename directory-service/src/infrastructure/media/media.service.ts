import { Inject, Injectable } from "@nestjs/common";
import { ProcessMediaMessageRequestDto } from "../../dtos";
import { ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { MEDIA_SERVICE_CLIENT } from "../../consts/infrastructure";
import { ConfigService } from "../../shared/config";

@Injectable()
export class MediaService {
  constructor(
    @Inject(MEDIA_SERVICE_CLIENT) private readonly client: ClientProxy,
    private readonly configService: ConfigService
  ) {}

  async processDirectory(
    params: ProcessMediaMessageRequestDto
  ): Promise<ProcessMediaMessageRequestDto> {
    console.log("params to media service 1: ", params);
    const mediaServiceAnswer = await lastValueFrom(
      this.client.send("media_queue", params)
    );

    console.log("mediaServiceAnswer 1: ", mediaServiceAnswer);

    return mediaServiceAnswer.data;
  }

  async getThumbnails(directoryId: string, path: string): Promise<string> {
    const config = await this.configService.getConfig();

    const url = new URL(
      `http://${config.mediaServiceHttp.host}:${config.mediaServiceHttp.port}/preview`
    );

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
}
