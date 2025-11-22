import { Injectable } from "@nestjs/common";
import { NoteEntity } from "../../entities";
import { BaseAbstractService } from "../../domain/services";
import { View } from "../../domain/types";
import { NoteRepository } from "./notes.repository";

@Injectable()
export class NoteService implements BaseAbstractService<NoteEntity> {
  constructor(private readonly noteRepository: NoteRepository) {}

  async get(
    filter?: Partial<NoteEntity>,
    pagination?: { limit: number; offset: number }
  ): Promise<NoteEntity[]> {
    return await this.noteRepository.findAll({
      filter,
      order: { name: "asc" },
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
    };

    view.next = await this.noteRepository.getNextItemId(note);

    view.previous = await this.noteRepository.getPreviousItemId(note);

    return view;
  }
}
