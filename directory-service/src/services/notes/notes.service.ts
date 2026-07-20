import { Injectable } from "@nestjs/common";
import { NoteEntity } from "../../entities";
import { BaseAbstractService } from "../../domain/services";
import { View } from "../../domain/types";
import { NoteRepository } from "./notes.repository";
import { AsyncLocalStorage } from "node:async_hooks";

@Injectable()
export class NoteService implements BaseAbstractService<NoteEntity> {
  constructor(
    private readonly noteRepository: NoteRepository,
    private readonly asyncLocalStorage: AsyncLocalStorage<any>,
  ) {}

  async get(
    filter?: Partial<NoteEntity>,
    pagination?: { limit: number; offset: number },
  ): Promise<NoteEntity[]> {
    const searchValue = this.asyncLocalStorage.getStore()["searchValue"];

    let whereCondition: Partial<NoteEntity> = {};
    let paginationValues = null;

    if (!searchValue) {
      whereCondition.parentId = filter.parentId ?? null;
    }

    if (searchValue || "parentId" in whereCondition) {
      paginationValues = pagination;
    }

    return await this.noteRepository.findAll({
      filter: whereCondition,
      order: { sortOrder: "asc", name: "asc" },
      pagination,
    });
  }

  async count(filter?: Partial<NoteEntity>): Promise<number> {
    return await this.noteRepository.count(filter);
  }

  async create(notes: Partial<NoteEntity[]>): Promise<NoteEntity[]> {
    return await this.noteRepository.upsertMany(notes);
  }

  async update(notes: Partial<NoteEntity[]>): Promise<NoteEntity[]> {
    return await this.noteRepository.update(notes);
  }

  async delete(notes: Partial<NoteEntity[]>): Promise<NoteEntity[]> {
    return await this.noteRepository.delete(notes);
  }

  async view(noteId: string): Promise<View> {
    const note = await this.noteRepository.findOne(noteId);

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
      attachments: [],
    };

    view.next = await this.noteRepository.getNextItemId(note);

    view.previous = await this.noteRepository.getPreviousItemId(note);

    return view;
  }
}
