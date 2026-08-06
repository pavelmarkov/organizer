import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { NoteEntity } from "../../entities";
import { NoteService } from "./notes.service";
import { AsyncLocalStorageModule } from "../../storage/async-local-storage.module";
import { NoteRepository } from "./notes.repository";
import { MediaModule } from "src/infrastructure/media";

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [NoteEntity] }),
    AsyncLocalStorageModule,
    MediaModule,
  ],
  providers: [NoteService, NoteRepository],
  exports: [NoteService],
})
export class NoteModule {}
