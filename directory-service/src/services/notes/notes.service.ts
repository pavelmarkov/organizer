import { Injectable } from "@nestjs/common";
import { NoteEntity } from "../../entities";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository, FilterQuery } from "@mikro-orm/sqlite";
import { v4 as uuidv4 } from "uuid";
import { AsyncLocalStorage } from "node:async_hooks";
import { BaseAbstractService } from "../../domain/services";
import { View } from "../../domain/types";

@Injectable()
export class NoteService implements BaseAbstractService<NoteEntity> {
  constructor(
    @InjectRepository(NoteEntity)
    private readonly noteRepository: EntityRepository<NoteEntity>,
    private readonly asyncLocalStorage: AsyncLocalStorage<any>
  ) {}

  private formWhereCondition(
    filter?: Partial<NoteEntity>
  ): FilterQuery<NoteEntity> {
    const projectId = this.asyncLocalStorage.getStore()["projectId"];
    const searchValue = this.asyncLocalStorage.getStore()["searchValue"];

    const whereCondition: FilterQuery<NoteEntity> = {
      projectId: projectId ?? null,
    };

    if (searchValue) {
      whereCondition.$or = [
        { name: { $like: `%${searchValue}%` } },
        { description: { $like: `%${searchValue}%` } },
      ];
    }

    return whereCondition;
  }

  async get(
    filter?: Partial<NoteEntity>,
    pagination?: { limit: number; offset: number }
  ): Promise<NoteEntity[]> {
    const whereCondition = this.formWhereCondition(filter);

    return await this.noteRepository.findAll({
      where: whereCondition,
      orderBy: { name: "asc" },
      offset: pagination?.offset ?? 0,
      limit: pagination?.limit ?? 10,
    });
  }

  async count(filter?: Partial<NoteEntity>): Promise<number> {
    const whereCondition = this.formWhereCondition(filter);

    return await this.noteRepository.count(whereCondition);
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
      previous: null,
      details: null,
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
