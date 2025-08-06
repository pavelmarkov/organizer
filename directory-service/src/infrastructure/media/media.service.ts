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
  ): Promise<{ directoryGuids: string[] }> {
    const mediaServiceAnswer = await firstValueFrom(
      this.client.send("media_queue", {
        directoryGuids,
        random: Math.random(),
      })
    );

    console.log("mediaServiceAnswer 1: ", mediaServiceAnswer);

    return mediaServiceAnswer.data.directoryGuids;
  }
}
