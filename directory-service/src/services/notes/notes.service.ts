import { Injectable } from "@nestjs/common";
import { NoteEntity } from "../../entities";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/sqlite";
import { v4 as uuidv4 } from "uuid";
import { AsyncLocalStorage } from "node:async_hooks";
import { BaseAbstractService } from "../../domain/services";

@Injectable()
export class NoteService implements BaseAbstractService<NoteEntity> {
  constructor(
    @InjectRepository(NoteEntity)
    private readonly noteRepository: EntityRepository<NoteEntity>,
    private readonly asyncLocalStorage: AsyncLocalStorage<any>
  ) {}

  async get(): Promise<NoteEntity[]> {
    const projectId = this.asyncLocalStorage.getStore()["projectId"];

    return await this.noteRepository.findAll({
      where: {
        projectId: projectId ?? null,
      },
    });
  }

  async create(notes: Partial<NoteEntity[]>): Promise<NoteEntity[]> {
    const projectId = this.asyncLocalStorage.getStore()["projectId"];

    notes.forEach((note) => {
      note.noteId = uuidv4();
      note.projectId = projectId;
    });

    return await this.noteRepository.upsertMany(notes, {
      onConflictFields: ["name"],
      onConflictAction: "merge",
      onConflictMergeFields: ["description", "type", "source", "tags"],
    });
  }
}
