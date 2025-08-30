import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { NoteEntity } from "../../entities";
import { NoteService } from "./notes.service";
import { AsyncLocalStorageModule } from "../../storage/async-local-storage.module";

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [NoteEntity] }),
    AsyncLocalStorageModule,
  ],
  providers: [NoteService],
  exports: [NoteService],
})
export class NoteModule {}
