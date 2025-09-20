import { Injectable } from "@nestjs/common";
import { NoteEntity } from "../../entities";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/sqlite";
import { v4 as uuidv4 } from "uuid";
import { AsyncLocalStorage } from "node:async_hooks";
import { BaseAbstractService } from "../../domain/services";
import { View } from "src/domain/types";

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

  async view(noteId: string): Promise<View> {
    const note = await this.noteRepository.findOne({
      noteId,
    });

    const view: View = {
      rowIdentifier: note.noteId,
      title: note.name,
      subtitle: note.type,
      text: note.description,
      tags: note.tags,
      image: null,
      next: null,
    };

    const nextItem = await this.noteRepository.findOne(
      {
        name: { $gt: note.name },
      },
      { orderBy: { name: "asc" } }
    );

    if (nextItem) {
      view.next = nextItem?.noteId;
    }

    if (!view.next) {
      const firstItem = await this.noteRepository.findOne(
        {
          name: { $lt: note.name },
        },
        { orderBy: { name: "asc" } }
      );

      view.next = firstItem?.noteId;
    }

    return view;
  }
}
