import { Inject, Injectable } from "@nestjs/common";
import { ProcessMediaMessageRequestDto } from "../../dtos";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, lastValueFrom } from "rxjs";
import { MEDIA_SERVICE_CLIENT } from "../../consts/infrastructure";

@Injectable()
export class MediaService {
  constructor(
    @Inject(MEDIA_SERVICE_CLIENT) private readonly client: ClientProxy
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
}
