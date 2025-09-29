import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  SimpleChanges,
  SimpleChange,
  HostListener,
} from '@angular/core';

import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { FormsModule } from '@angular/forms';
import { Listbox, ListboxFilterEvent } from 'primeng/listbox';
import { TagsService } from '../../core/services';
import { ScrollerLazyLoadEvent } from 'primeng/scroller';
import { CardModel, TagModel } from '../../core/domain';

import { Clipboard } from '@angular/cdk/clipboard';

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

  @Output() nextItemEvent = new EventEmitter();

  @Output() previousItemEvent = new EventEmitter();

  @Output() tagChangedEvent = new EventEmitter<string[]>();

  tags: TagModel[] = [];

  filterValue: string | null = null;

  constructor(
    private cd: ChangeDetectorRef,
    private tagsService: TagsService,
    private clipboard: Clipboard
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

  @HostListener('window:keydown.ArrowRight', ['$event'])
  next($event: MouseEvent | KeyboardEvent) {
    this.nextItemEvent.emit();
  }

  @HostListener('window:keydown.ArrowLeft', ['$event'])
  previous($event: MouseEvent | KeyboardEvent) {
    this.previousItemEvent.emit();
  }

  newTag($event: MouseEvent): void {
    console.log(this.filterValue);
    if (!this.filterValue) {
      return;
    }
    this.tagsService.create([{ name: this.filterValue }]).subscribe((data) => {
      if (data?.length) {
        this.loadTags();
      }
    });
  }

  onFilter($event: ListboxFilterEvent): void {
    this.filterValue = $event.filter;
  }

  copyMessage(value: string | undefined) {
    if (!value) {
      return;
    }

    const pending = this.clipboard.beginCopy(value);

    let remainingAttempts = 3;
    const attempt = () => {
      const result = pending.copy();
      if (!result && --remainingAttempts) {
        setTimeout(attempt);
      } else {
        pending.destroy();
      }
    };
    attempt();
  }
}
