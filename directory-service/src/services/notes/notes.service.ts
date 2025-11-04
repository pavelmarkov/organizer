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
    filter?: FilterQuery<NoteEntity>
  ): FilterQuery<NoteEntity> {
    const projectId = this.asyncLocalStorage.getStore()["projectId"];
    const searchValue = this.asyncLocalStorage.getStore()["searchValue"];

    const projectIdCondition: FilterQuery<NoteEntity> = [
      {
        projectId: projectId ?? null,
      },
    ];

    const searchValueCondition: FilterQuery<NoteEntity> = [];
    if (searchValue) {
      searchValueCondition.push({
        $or: [
          { name: { $like: `%${searchValue}%` } },
          { description: { $like: `%${searchValue}%` } },
        ],
      });
    }

    const whereCondition: FilterQuery<NoteEntity> = [
      ...projectIdCondition,
      ...searchValueCondition,
    ];

    if (filter) {
      whereCondition.push(filter);
    }

    return { $and: whereCondition };
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
      this.formWhereCondition({
        name: { $gt: note.name },
      }),
      { orderBy: { name: "asc" } }
    );

    if (nextItem) {
      view.next = nextItem?.noteId;
    }

    const previousItem = await this.noteRepository.findOne(
      this.formWhereCondition({
        name: { $lt: note.name },
      }),
      { orderBy: { name: "desc" } }
    );

    if (previousItem) {
      view.previous = previousItem?.noteId;
    }

    if (!view.next) {
      const firstItem = await this.noteRepository.findOne(
        this.formWhereCondition(),
        { orderBy: { name: "asc" } }
      );

      view.next = firstItem?.noteId;
    }

    if (!view.previous) {
      const lastItem = await this.noteRepository.findOne(
        this.formWhereCondition(),
        { orderBy: { name: "desc" } }
      );

      view.previous = lastItem?.noteId;
    }

    return view;
  }
}
