import { Inject, Injectable } from "@nestjs/common";
import { GetDirectoryResponseDto } from "../../dtos";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { MEDIA_SERVICE_CLIENT } from "../../consts/infrastructure";

@Injectable()
export class MediaService {
  constructor(
    @Inject(MEDIA_SERVICE_CLIENT) private readonly client: ClientProxy
  ) {}

  async processDirectory(
    directoryGuids: string[]
  ): Promise<GetDirectoryResponseDto> {
    const directory: GetDirectoryResponseDto["directory"] = [];

    const mediaServiceAnswer = await firstValueFrom(
      this.client.send("media_queue", {
        directoryGuids,
        random: Math.random(),
      })
    );

    console.log("mediaServiceAnswer: ", mediaServiceAnswer);

    return {
      directory,
    };
  }
}
