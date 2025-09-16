import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  SimpleChanges,
  SimpleChange,
} from '@angular/core';

import { DialogModule } from 'primeng/dialog';
import { Card, CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { FormsModule } from '@angular/forms';
import { Listbox } from 'primeng/listbox';
import { TagsService } from '../../core/services';
import { ScrollerLazyLoadEvent } from 'primeng/scroller';
import { CardModel, TagModel } from '../../core/domain';

@Component({
  selector: 'app-card-layout',
  imports: [DialogModule, CardModule, ButtonModule, FormsModule, Listbox],
  templateUrl: './card-layout.component.html',
  styleUrl: './card-layout.component.css',
})
export class CardLayoutComponent implements OnInit {
  @Input() cardData: CardModel = {
    rowIdentifier: null,
    tags: [],
  };

  @Input() visible: boolean = false;

  @Output() dialogPanelCloseEvent = new EventEmitter();

  @Output() tagChangedEvent = new EventEmitter<string[]>();

  tags: TagModel[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private tagsService: TagsService
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges & { visible: SimpleChange }): void {
    if (changes.visible?.currentValue) {
      this.loadTags();
    }
  }

  loadTags(event?: ScrollerLazyLoadEvent) {
    this.tagsService.getTags().subscribe((data) => {
      this.tags = data;
    });
  }

  onTagSelectionChange(event: any) {
    this.tagChangedEvent.emit(this.cardData.tags);
  }

  dialogClosed() {
    this.dialogPanelCloseEvent.emit();
  }
}
