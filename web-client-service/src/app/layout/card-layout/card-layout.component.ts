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
  ElementRef,
  inject,
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
import { AccordionModule, AccordionTabOpenEvent } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-card-layout',
  imports: [
    DialogModule,
    CardModule,
    ButtonModule,
    FormsModule,
    Listbox,

    AccordionModule,

    CommonModule,
  ],
  templateUrl: './card-layout.component.html',
  styleUrl: './card-layout.component.css',
})
export class CardLayoutComponent implements OnInit {
  @Input() cardData: CardModel = {
    rowIdentifier: null,
    tags: [],
    attachments: [],
  };

  @Input() visible: boolean = false;

  @Output() dialogPanelCloseEvent = new EventEmitter();

  @Output() nextItemEvent = new EventEmitter();

  @Output() previousItemEvent = new EventEmitter();

  @Output() tagChangedEvent = new EventEmitter<string[]>();

  tags: TagModel[] = [];

  filterValue: string | null = null;

  activeTabIndex: number = -1;

  attachmentStartTime!: number;

  loading!: boolean;

  private route = inject(ActivatedRoute);

  constructor(
    private cd: ChangeDetectorRef,
    private tagsService: TagsService,
    private clipboard: Clipboard,
  ) {}

  ngOnInit() {
    const startTimeRouteParam = this.route.snapshot.paramMap.get('startTime');
    if (startTimeRouteParam) {
      this.attachmentStartTime = Number.parseInt(startTimeRouteParam);
      this.activeTabIndex = 0;
      this.loadVideoPlayer();
    }
  }

  ngOnChanges(changes: SimpleChanges & { visible: SimpleChange }): void {
    if (changes.visible?.currentValue) {
      this.loadTags();
    }
  }

  setDefaults(): void {
    this.attachmentStartTime = 0;
    this.activeTabIndex = -1;
    this.loading = false;
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
    this.setDefaults();
    this.dialogPanelCloseEvent.emit();
  }

  @HostListener('window:keydown.ArrowRight', ['$event'])
  next($event: MouseEvent | KeyboardEvent) {
    this.setDefaults();
    this.nextItemEvent.emit();
  }

  @HostListener('window:keydown.ArrowLeft', ['$event'])
  previous($event: MouseEvent | KeyboardEvent) {
    this.setDefaults();
    this.previousItemEvent.emit();
  }

  onAttachmentOpen($event: AccordionTabOpenEvent) {
    this.activeTabIndex = $event.index;
    if (!this.loading) {
      this.loadVideoPlayer();
    }
  }

  loadVideoPlayer(): void {
    const videoElements = document.getElementsByClassName('player');
    for (let videoElement of videoElements) {
      const element = videoElement as HTMLVideoElement;
      if (this.attachmentStartTime) {
        element.src = `${element.src}#t=${this.attachmentStartTime}`;
      }
      // element.style.display = 'inline-block';
      this.loading = true;
      element.load();
      element.onloadeddata = () => {
        this.loading = false;
      };
    }
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
