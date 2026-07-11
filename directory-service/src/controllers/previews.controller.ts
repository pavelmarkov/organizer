import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { PreviewService } from "../services/previews";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";

@Controller("previews")
export class PreviewsController {
  constructor(private readonly previewsService: PreviewService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  uploadPreview(
    @Query("entityId") entityId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.previewsService.add(entityId, file);
  }
}
