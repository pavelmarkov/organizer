import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModel } from '../../core/domain';
import { TagsService } from '../../core/services';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-tags-layout',
  imports: [TableModule],
  templateUrl: './tags-layout.component.html',
  styleUrl: './tags-layout.component.css',
})
export class TagsLayoutComponent {
  tags!: TagModel[];

  constructor(
    private tagsService: TagsService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.getTags();

    this.dataService.currentProject.subscribe((data) => {
      this.getTags();
    });
  }

  getTags() {
    this.tagsService.getTags().subscribe((data) => {
      this.tags = data;
    });
  }
}
