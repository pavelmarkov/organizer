import { Injectable } from "@nestjs/common";
import { NoteEntity } from "../../entities";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/sqlite";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(NoteEntity)
    private readonly noteRepository: EntityRepository<NoteEntity>
  ) {}

  async getNotes(): Promise<NoteEntity[]> {
    return await this.noteRepository.findAll();
  }

  async createNotes(notes: Partial<NoteEntity[]>): Promise<NoteEntity[]> {
    notes.forEach((note) => {
      note.noteId = uuidv4();
    });
    return await this.noteRepository.upsertMany(notes, {
      onConflictFields: ["name"],
      onConflictAction: "merge",
      onConflictMergeFields: ["description", "type", "source", "tags"],
    });
  }
}
