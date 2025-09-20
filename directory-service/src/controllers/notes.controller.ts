import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { NoteService } from "../services/notes";
import { NoteEntity } from "../entities";
import { ViewDto } from "../dtos";

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

  @Get("view")
  viewDirectory(@Query("noteId") noteId: string): Promise<ViewDto> {
    return this.noteService.view(noteId);
  }
}
