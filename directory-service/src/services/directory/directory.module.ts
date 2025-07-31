import { Module } from "@nestjs/common";
import { DirectoryController } from "../../controllers";
import { DirectoryService } from "./directory.service";
import { MediaModule } from "../../infrastructure/media";

@Module({
  imports: [MediaModule],
  controllers: [DirectoryController],
  providers: [DirectoryService],
})
export class DirectoryModule {}
