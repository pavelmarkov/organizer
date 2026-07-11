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
  ModelSignal,
  model,
} from '@angular/core';

import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { FormsModule } from '@angular/forms';
import { Listbox, ListboxFilterEvent } from 'primeng/listbox';
import {
  MemoriesService,
  PreviewService,
  TagsService,
} from '../../core/services';
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
import { FileUpload, FileUploadHandlerEvent } from 'primeng/fileupload';

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

    FileUpload,
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
  @Input() showTags: boolean = true;

  @Output() dialogPanelCloseEvent = new EventEmitter();

  @Output() nextItemEvent = new EventEmitter();

  @Output() previousItemEvent = new EventEmitter();

  @Output() tagChangedEvent = new EventEmitter<string[]>();

  tags: TagModel[] = [];

  filterValue: string | null = null;

  activeTabIndex: ModelSignal<number> = model(-1);

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
    private previewService: PreviewService,
  ) {}

  ngOnInit() {
    const startTimeRouteParam = this.route.snapshot.paramMap.get('startTime');
    if (startTimeRouteParam) {
      this.attachmentStartTime = Number.parseInt(startTimeRouteParam);
      this.activeTabIndex.set(0);
      this.loadVideoPlayer();
    }
  }

  loadMemoriesList(): void {
    this.memoriesService.get().subscribe((data) => {
      this.memoriesList = data;
      console.log(this.memoriesList);
    });
  }

  ngOnChanges(
    changes: SimpleChanges & { visible: SimpleChange; cardData: CardModel },
  ): void {
    if (changes.visible?.currentValue) {
      this.loadTags();
    }
    if (changes.cardData) {
      this.sortTags();
    }
  }

  setDefaults(): void {
    this.attachmentStartTime = 0;
    this.activeTabIndex.set(-1);
    this.loading = false;
  }

  sortTags() {
    if (!this.cardData?.tags?.length) {
      return;
    }
    this.tags = this.tags.sort((a, b) => {
      const av = Number(this.cardData.tags.includes(b.tagId));
      const bv = Number(this.cardData.tags.includes(a.tagId));
      return av - bv;
    });
  }

  loadTags(event?: ScrollerLazyLoadEvent) {
    if (!this.showTags) {
      return;
    }
    this.tagsService.getTags({}, {}).subscribe((data) => {
      this.cardData.tags;
      this.tags = data;
      this.sortTags();
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
    this.activeTabIndex.set($event.index);
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

  onSelectClick($event: MouseEvent): void {
    this.loadMemoriesList();
  }

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
    if (this.clipStartTimeInSeconds >= this.clipEndTimeInSeconds) {
      return;
    }

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
        memoryGuid: this.selectedMemory ?? null,
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
      this.loading = true;
      element.onerror = (event) => {
        console.log('Error during video loading');
        element.style.display = 'none';
      };

      element.load();
      element.onloadeddata = () => {
        this.loading = false;
        // element.style.display = 'inline-block';
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

  initChangePreview(): void {
    if (this.cardData.image) {
      this.cardData.image = undefined;
    }
  }
  choose(event: MouseEvent, callback: VoidFunction) {
    callback();
  }
  uploadPreview(event: FileUploadHandlerEvent) {
    event.files.forEach((file) => {
      const reader: FileReader = new FileReader();

      reader.onload = () => {
        const fileContent = reader.result;
        if (typeof fileContent === 'string') {
          if (!this.cardData?.rowIdentifier) {
            return;
          }
          this.previewService
            .add(this.cardData.rowIdentifier, file)
            .subscribe((result) => {
              this.cardData.image = fileContent.replace(
                /data:image\/[a-zA-Z0-9+.-]+;base64,/,
                '',
              );
            });
        }
      };

      reader.readAsDataURL(file);
    });
  }
}
