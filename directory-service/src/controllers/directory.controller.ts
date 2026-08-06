import {
  Body,
  Controller,
  Delete,
  Get,
  ParseBoolPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { DirectoryService } from "../services/directory";
import { DirectoryEntity } from "src/entities";
import { ViewDto } from "../dtos";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";

@Controller("directory")
export class DirectoryController {
  constructor(private readonly directoryService: DirectoryService) {}

  @Get()
  getDirectory(
    @Query("directoryId") directoryId: string,
    @Query("parentId") parentId: string,
    @Query("isFolder", new ParseBoolPipe({ optional: true })) isFolder: boolean,
    @Query("limit") limit: number,
    @Query("offset") offset: number,
  ): Promise<Partial<DirectoryEntity[]>> {
    return this.directoryService.get(
      { parentId, directoryId, isFolder },
      { limit, offset },
    );
  }

  @Get("count")
  countNotes(): Promise<number> {
    return this.directoryService.count();
  }

  @Get("view")
  viewDirectory(@Query("directoryId") directoryId: string): Promise<ViewDto> {
    return this.directoryService.view(directoryId);
  }

  @Post("process")
  processDirectory(
    @Body() params: { directoryGuids: string[] },
  ): Promise<{ message: string }> {
    return this.directoryService.process(params.directoryGuids);
  }

  @Post()
  importDirectory(
    @Body() directories: DirectoryEntity[],
  ): Promise<Partial<DirectoryEntity>[]> {
    return this.directoryService.create(directories);
  }

  @Put()
  update(
    @Body() directories: DirectoryEntity[],
  ): Promise<Partial<DirectoryEntity>[]> {
    return this.directoryService.update(directories);
  }

  @Delete()
  deleteNotes(@Body() params: DirectoryEntity[]): Promise<DirectoryEntity[]> {
    return this.directoryService.delete(params);
  }

  @Post("preview")
  @UseInterceptors(FileInterceptor("file"))
  uploadPreview(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}
