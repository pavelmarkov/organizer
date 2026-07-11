import { Inject, Injectable } from "@nestjs/common";
import { MediaService } from "../../infrastructure/media/media.service";
import { AddPreviewResponseDto } from "../../dtos";

@Injectable()
export class PreviewService {
  constructor(
    @Inject(MediaService) private readonly mediaClient: MediaService,
  ) {}

  async add(
    entityId: string,
    file: Express.Multer.File,
  ): Promise<AddPreviewResponseDto> {
    const preview = await this.mediaClient.addMedia(entityId, file);

    return { status: "uploaded" };
  }
}
