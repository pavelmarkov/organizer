import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { NoteEntity } from "../../entities";
import { NoteService } from "./notes.service";
import { AsyncLocalStorageModule } from "../../storage/async-local-storage.module";
import { NoteRepository } from "./notes.repository";

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [NoteEntity] }),
    AsyncLocalStorageModule,
  ],
  providers: [NoteService, NoteRepository],
  exports: [NoteService],
})
export class NoteModule {}
