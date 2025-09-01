import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { NoteService } from "src/services/notes";
import { NoteEntity } from "src/entities";

@Controller()
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get("notes")
  getNotes(): Promise<NoteEntity[]> {
    return this.noteService.getNotes();
  }

  @Post("notes")
  createNotes(@Body() params: NoteEntity[]): Promise<NoteEntity[]> {
    return this.noteService.createNotes(params);
  }
}
