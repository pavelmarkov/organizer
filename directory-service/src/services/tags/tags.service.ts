import { Inject, Injectable } from "@nestjs/common";
import { TagEntity } from "../../entities";
import { BaseAbstractService } from "../../domain/services";
import { TagRepository } from "./tags.repository";
import { View } from "src/domain/types";
import { MediaService } from "../../infrastructure/media/media.service";

@Injectable()
export class TagsService implements BaseAbstractService<TagEntity> {
  constructor(
    private readonly tagsRepository: TagRepository,
    @Inject(MediaService) private readonly mediaClient: MediaService,
  ) {}

  async get(
    filter?: Partial<TagEntity>,
    pagination?: { limit: number; offset: number },
  ): Promise<TagEntity[]> {
    return await this.tagsRepository.findAll({
      filter,
      order: { name: "asc" },
      pagination,
    });
  }

  async count(filter?: Partial<TagEntity>): Promise<number> {
    return await this.tagsRepository.count(filter);
  }

  async create(tags: Partial<TagEntity[]>): Promise<TagEntity[]> {
    return await this.tagsRepository.upsertMany(tags);
  }

  async update(tags: Partial<TagEntity[]>): Promise<TagEntity[]> {
    return await this.tagsRepository.update(tags);
  }

  async delete(tags: Partial<TagEntity[]>): Promise<TagEntity[]> {
    return await this.tagsRepository.delete(tags);
  }

  async view(tagId: string): Promise<View> {
    const tag = await this.tagsRepository.findOne(tagId);

    const view: View = {
      rowIdentifier: tag.tagId,
      title: tag.name,
      subtitle: null,
      text: tag.description,
      tags: [],
      image: null,
      next: null,
      previous: null,
      details: null,
      attachments: [],
    };

    view.image = await this.mediaClient.getThumbnails(tag.tagId, null);

    view.next = await this.tagsRepository.getNextItemId(tag);

    view.previous = await this.tagsRepository.getPreviousItemId(tag);

    return view;
  }
}
