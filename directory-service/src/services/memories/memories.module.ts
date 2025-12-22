import { Module } from "@nestjs/common";
import { AsyncLocalStorageModule } from "../../storage/async-local-storage.module";
import { MemoriesService } from "./memories.service";
import { MediaModule } from "../../infrastructure/media";

@Module({
  imports: [AsyncLocalStorageModule, MediaModule],
  providers: [MemoriesService],
  exports: [MemoriesService],
})
export class MemoriesModule {}
