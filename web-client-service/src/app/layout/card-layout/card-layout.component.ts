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
import { MemoriesService, TagsService } from '../../core/services';
import { ScrollerLazyLoadEvent } from 'primeng/scroller';
import {
  CardModel,
  MemoriesModel,
  MemorySourceModel,
  TagModel,
} from '../../core/domain';

import { Clipboard } from '@angular/cdk/clipboard';
import { AccordionModule, AccordionTabOpenEvent } from 'primeng/accordion';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';

import { SelectModule } from 'primeng/select';

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

    InputTextModule,
    InputMaskModule,
    FormsModule,
    SelectModule,
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

  clipStartTimeString: string | undefined;
  clipEndTimeString: string | undefined;
  clipStartTimeInSeconds: number | undefined;
  clipEndTimeInSeconds: number | undefined;

  memoriesList: MemoriesModel[] = [];
  selectedMemory: string | undefined;

  private route = inject(ActivatedRoute);

  constructor(
    private cd: ChangeDetectorRef,
    private tagsService: TagsService,
    private clipboard: Clipboard,
    private memoriesService: MemoriesService,
  ) {}

  ngOnInit() {
    const startTimeRouteParam = this.route.snapshot.paramMap.get('startTime');
    if (startTimeRouteParam) {
      this.attachmentStartTime = Number.parseInt(startTimeRouteParam);
      this.activeTabIndex = 0;
      this.loadVideoPlayer();
    }
  }

  loadMemoriesList(): void {
    this.memoriesService.get().subscribe((data) => {
      this.memoriesList = data;
      console.log(this.memoriesList);
    });
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
    this.loadMemoriesList();
  }

  private convertSecondsToTimeString = (totalSeconds: number) => {
    totalSeconds = Math.floor(totalSeconds);

    const seconds = totalSeconds % 60;

    const totalMinutes = (totalSeconds - seconds) / 60;
    const minutes = totalMinutes % 60;

    const hours = (totalMinutes - minutes) / 60;

    const hourString = hours.toString().padStart(2, '0');
    const minuteString = minutes.toString().padStart(2, '0');
    const secondString = seconds.toString().padStart(2, '0');

    return `${hourString}:${minuteString}:${secondString}`;
  };

  clipStart(attachmentId: string) {
    const videoElement = document.getElementById(
      attachmentId,
    ) as HTMLVideoElement | null;
    if (!videoElement) {
      return;
    }
    this.clipStartTimeInSeconds = Math.floor(videoElement.currentTime);
    this.clipStartTimeString = this.convertSecondsToTimeString(
      videoElement.currentTime,
    );
  }

  clipEnd(attachmentId: string) {
    const videoElement = document.getElementById(
      attachmentId,
    ) as HTMLVideoElement | null;
    if (!videoElement) {
      return;
    }
    this.clipEndTimeInSeconds = Math.floor(videoElement.currentTime);
    this.clipEndTimeString = this.convertSecondsToTimeString(
      videoElement.currentTime,
    );
  }

  generateClip() {
    if (!this.cardData.rowIdentifier) {
      return;
    }
    if (!this.clipStartTimeInSeconds) {
      return;
    }
    if (!this.clipEndTimeInSeconds) {
      return;
    }
    if (!this.selectedMemory) {
      return;
    }

    console.log(this.cardData.rowIdentifier);
    console.log(this.clipStartTimeInSeconds);
    console.log(this.clipEndTimeInSeconds);
    console.log(this.selectedMemory);

    this.memoriesService
      .generate({
        directories: [
          {
            directoryId: this.cardData.rowIdentifier,
            interval: {
              start: this.clipStartTimeInSeconds,
              end: this.clipEndTimeInSeconds,
            },
          },
        ],
        memoryGuid: this.selectedMemory,
      })
      .subscribe((data) => {
        console.log(data);
      });
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
