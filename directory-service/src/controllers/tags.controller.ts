import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { TagsService } from "../services/";
import { TagEntity } from "../entities";

@Controller("tags")
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  getTags(): Promise<TagEntity[]> {
    return this.tagsService.get();
  }

  @Post()
  createTags(@Body() params: TagEntity[]): Promise<TagEntity[]> {
    return this.tagsService.create(params);
  }
}
