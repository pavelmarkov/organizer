import { Module } from "@nestjs/common";
import { MediaModule } from "../../infrastructure/media";
import { PreviewService } from "./previews.service";

@Module({
  imports: [MediaModule],
  providers: [PreviewService],
  exports: [PreviewService],
})
export class PreviewsModule {}
