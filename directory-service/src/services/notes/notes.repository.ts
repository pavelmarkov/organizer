import { Injectable } from "@nestjs/common";
import { NoteEntity } from "../../entities";
import { InjectRepository } from "@mikro-orm/nestjs";
import {
  EntityRepository,
  FilterQuery,
  OrderDefinition,
} from "@mikro-orm/sqlite";
import { v4 as uuidv4 } from "uuid";
import { AsyncLocalStorage } from "node:async_hooks";
import { BaseAbstractRepository } from "../../domain/repositories";

@Injectable()
export class NoteRepository implements BaseAbstractRepository<NoteEntity> {
  constructor(
    @InjectRepository(NoteEntity)
    private readonly noteRepository: EntityRepository<NoteEntity>,
    private readonly asyncLocalStorage: AsyncLocalStorage<any>,
  ) {}

  private formWhereCondition(
    filter?: FilterQuery<NoteEntity>,
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

  async findAll(params: {
    filter?: Partial<NoteEntity>;
    pagination?: { limit: number; offset: number };
    order?: OrderDefinition<NoteEntity>;
  }): Promise<NoteEntity[]> {
    const { filter, pagination, order } = params;

    const whereCondition = this.formWhereCondition(filter);

    return await this.noteRepository.findAll({
      where: whereCondition,
      orderBy: order,
      offset: pagination?.offset ?? null,
      limit: pagination?.limit ?? null,
    });
  }

  async count(filter?: Partial<NoteEntity>): Promise<number> {
    filter = filter ?? {};
    filter.parentId = filter.parentId ?? null;

    const whereCondition = this.formWhereCondition(filter);

    return await this.noteRepository.count(whereCondition);
  }

  async findOne(id: string): Promise<NoteEntity> {
    return await this.noteRepository.findOne({
      noteId: id,
    });
  }

  async update(
    notes: (Partial<NoteEntity> & Pick<NoteEntity, "noteId">)[],
  ): Promise<NoteEntity[]> {
    if (!notes.length) {
      return [];
    }

    const noteIds = notes.map((note) => note.noteId);

    const currentNotes = await this.noteRepository.findAll({
      where: {
        noteId: { $in: noteIds },
      },
    });

    currentNotes.forEach((note) => {
      const updateData = notes.find(
        (updateDataNote) => updateDataNote.noteId === note.noteId,
      );
      Object.assign(note, updateData);
    });

    return await this.noteRepository.upsertMany(currentNotes, {
      onConflictFields: ["noteId"],
      onConflictAction: "merge",
      onConflictMergeFields: [
        "description",
        "type",
        "source",
        "tags",
        "parentId",
      ],
    });
  }

  async delete(
    notes: (Partial<NoteEntity> & Pick<NoteEntity, "noteId">)[],
  ): Promise<NoteEntity[]> {
    if (!notes.length) {
      return [];
    }

    const noteIds = notes.map((note) => note.noteId);

    const currentNotes = await this.noteRepository.findAll({
      where: {
        noteId: { $in: noteIds },
      },
    });

    await this.noteRepository.nativeDelete({
      noteId: { $in: noteIds },
    });

    return currentNotes;
  }

  async upsertMany(
    notes: (Partial<NoteEntity> & Pick<NoteEntity, "name">)[],
  ): Promise<NoteEntity[]> {
    const projectId = this.asyncLocalStorage.getStore()["projectId"];

    notes.forEach((note) => {
      note.noteId = uuidv4();
      note.projectId = projectId;
      note.tags = note.tags ?? [];
    });

    return await this.noteRepository.upsertMany(notes, {
      onConflictFields: ["name"],
      onConflictAction: "merge",
      onConflictMergeFields: ["description", "type", "source", "tags"],
    });
  }

  async getNextItemId(currentItem: NoteEntity): Promise<string | null> {
    const nextItem = await this.noteRepository.findOne(
      this.formWhereCondition({
        name: { $gt: currentItem.name },
        parentId: currentItem.parentId,
      }),
      { orderBy: { name: "asc" } },
    );

    if (nextItem) {
      return nextItem.noteId;
    }

    const firstItem = await this.noteRepository.findOne(
      this.formWhereCondition({ parentId: currentItem.parentId }),
      { orderBy: { name: "asc" } },
    );

    if (firstItem) {
      return firstItem.noteId;
    }

    return null;
  }

  async getPreviousItemId(currentItem: NoteEntity): Promise<string | null> {
    const previousItem = await this.noteRepository.findOne(
      this.formWhereCondition({
        name: { $lt: currentItem.name },
        parentId: currentItem.parentId,
      }),
      { orderBy: { name: "desc" } },
    );

    if (previousItem) {
      return previousItem.noteId;
    }

    const lastItem = await this.noteRepository.findOne(
      this.formWhereCondition({ parentId: currentItem.parentId }),
      { orderBy: { name: "desc" } },
    );

    if (lastItem) {
      return lastItem.noteId;
    }

    return null;
  }
}
