import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { NoteService } from "../services/notes";
import { NoteEntity } from "../entities";
import { ViewDto } from "../dtos";

@Controller("notes")
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  getNotes(
    @Query("limit") limit: number,
    @Query("offset") offset: number
  ): Promise<NoteEntity[]> {
    return this.noteService.get(null, { limit, offset });
  }

  @Get("count")
  countNotes(): Promise<number> {
    return this.noteService.count();
  }

  @Post()
  createNotes(@Body() params: NoteEntity[]): Promise<NoteEntity[]> {
    return this.noteService.create(params);
  }

  @Put()
  updateNotes(@Body() params: NoteEntity[]): Promise<NoteEntity[]> {
    return this.noteService.update(params);
  }

  @Get("view")
  viewNote(@Query("noteId") noteId: string): Promise<ViewDto> {
    return this.noteService.view(noteId);
  }

  @Delete()
  deleteNotes(@Body() params: NoteEntity[]): Promise<NoteEntity[]> {
    return this.noteService.delete(params);
  }
}
