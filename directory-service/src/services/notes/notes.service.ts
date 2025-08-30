import { Injectable } from "@nestjs/common";
import { NoteEntity } from "../../entities";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/sqlite";
import { v4 as uuidv4 } from "uuid";
import { AsyncLocalStorage } from "node:async_hooks";

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(NoteEntity)
    private readonly noteRepository: EntityRepository<NoteEntity>,
    private readonly asyncLocalStorage: AsyncLocalStorage<any>
  ) {}

  async getNotes(): Promise<NoteEntity[]> {
    const projectId = this.asyncLocalStorage.getStore()["projectId"];
    return await this.noteRepository.findAll({
      where: {
        projectId: projectId ?? null,
      },
    });
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
