import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { NoteEntity } from "../../entities";
import { NoteService } from "./notes.service";

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [NoteEntity] })],
  providers: [NoteService],
  exports: [NoteService],
})
export class NoteModule {}
