import { Module } from "@nestjs/common";
import { DirectoryController } from "../../controllers";
import { DirectoryService } from "./directory.service";
import { MediaModule } from "../../infrastructure/media";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { DirectoryEntity } from "src/entities";

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [DirectoryEntity] }),
    MediaModule,
  ],
  controllers: [DirectoryController],
  providers: [DirectoryService],
})
export class DirectoryModule {}
