import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { NoteService } from "src/services/notes";
import { NoteEntity } from "src/entities";

@Controller("notes")
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  getNotes(): Promise<NoteEntity[]> {
    return this.noteService.get();
  }

  @Post()
  createNotes(@Body() params: NoteEntity[]): Promise<NoteEntity[]> {
    return this.noteService.create(params);
  }
}
