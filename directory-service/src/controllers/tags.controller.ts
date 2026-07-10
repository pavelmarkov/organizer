import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { TagsService } from "../services/";
import { TagEntity } from "../entities";
import { ViewDto } from "src/dtos";

@Controller("tags")
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  getTags(
    @Query("parentId") parentId: string,
    @Query("limit") limit: number,
    @Query("offset") offset: number,
  ): Promise<TagEntity[]> {
    return this.tagsService.get({ parentId }, { limit, offset });
  }

  @Get("count")
  countTags(): Promise<number> {
    return this.tagsService.count();
  }

  @Post()
  createTags(@Body() params: TagEntity[]): Promise<TagEntity[]> {
    return this.tagsService.create(params);
  }

  @Put()
  updateTags(@Body() params: TagEntity[]): Promise<TagEntity[]> {
    return this.tagsService.update(params);
  }

  @Get("view")
  viewTag(@Query("tagId") tagId: string): Promise<ViewDto> {
    return this.tagsService.view(tagId);
  }

  @Delete()
  deleteTags(@Body() params: TagEntity[]): Promise<TagEntity[]> {
    return this.tagsService.delete(params);
  }
}
