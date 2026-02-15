import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { ActionsLayoutComponent } from '../actions-layout/actions-layout.component';
import { MemoriesService } from '../../core/services';
import { CommonModule } from '@angular/common';
import { RoundRobin } from './utils/round-robin';
import { MemoriesModel, MemorySourceModel } from '../../core/domain';
import { SplitterModule } from 'primeng/splitter';
import { OrderListModule } from 'primeng/orderlist';
import { Listbox, ListboxFilterEvent } from 'primeng/listbox';
import { ListboxModule } from 'primeng/listbox';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../shared/services/data.service';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem, MessageService } from 'primeng/api';

import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ButtonGroup } from 'primeng/buttongroup';

import { MessageModule } from 'primeng/message';

import { InplaceModule } from 'primeng/inplace';

@Component({
  selector: 'app-memories-layout',
  imports: [
    CommonModule,
    CardModule,
    PanelModule,
    ActionsLayoutComponent,
    SplitterModule,
    OrderListModule,
    ListboxModule,
    FormsModule,

    SpeedDialModule,

    DialogModule,
    ButtonModule,
    ButtonGroup,
    InputTextModule,
    TextareaModule,
    CommonModule,

    MessageModule,

    InplaceModule,
  ],
  providers: [MessageService],
  templateUrl: './memories-layout.component.html',
  styleUrl: './memories-layout.component.css',
})
export class MemoriesLayoutComponent {
  // @ViewChild('videoPlayer1') videoPlayer1: ElementRef<HTMLVideoElement> =
  //   new ElementRef<HTMLVideoElement>({} as HTMLVideoElement);
  @ViewChild('videoPlayer2') videoPlayer2: ElementRef<HTMLVideoElement> =
    new ElementRef<HTMLVideoElement>({} as HTMLVideoElement);

  constructor(
    private cd: ChangeDetectorRef,
    private memoriesService: MemoriesService,
    private dataService: DataService,
  ) {}

  muted: boolean = true;

  roundRobin: RoundRobin = new RoundRobin([]);

  memories: MemoriesModel[] = [];
  selectedMemoryId!: string;
  currentMemory: MemoriesModel = {
    id: '',
    name: '',
    description: '',
  };
  currentMemorySource: MemorySourceModel = new MemorySourceModel();
  filterValue: string | null = null;

  createDialogVisible: boolean = false;

  items!: MenuItem[];

  doRepeat: boolean = false;

  secondVideoPlayerId: string = 'videoPlayer2';

  isSourceNameEditModeOn: boolean = false;

  ngOnInit() {
    this.items = [
      {
        icon: 'pi pi-pencil',
        command: () => {
          this.edit();
        },
      },
      {
        icon: 'pi pi-trash',
        command: () => {
          this.delete();
        },
      },
      {
        icon: 'pi pi-external-link',
        command: () => {
          this.view();
        },
      },
    ];

    this.get();

    this.dataService.currentProject.subscribe((data) => {
      this.get();
    });
  }

  toggleRepeat(): void {
    this.doRepeat = !this.doRepeat;
  }

  view(): void {}

  goToDirectory(): void {
    const currentMemoryPart = this.roundRobin.getCurrent();
    const directoryUrl: string = this.memoriesService.getDirectoryUrl({
      directoryId: currentMemoryPart.directoryId,
      projectId: this.dataService.getProject() ?? 'undefined',
      startTime: currentMemoryPart.info.startTimeInSeconds,
    });
    console.log(directoryUrl);

    window.open(directoryUrl, '_blank');
  }

  edit(): void {
    this.createDialogVisible = true;
  }
  save(): void {
    console.log(this.currentMemory);
    this.memoriesService.update([this.currentMemory]).subscribe((data) => {
      this.get();
      this.hideCreateDialog();
    });
  }
  delete(): void {
    this.memoriesService.remove([this.currentMemory]).subscribe((data) => {
      this.get();
      this.hideCreateDialog();
    });
  }
  hideCreateDialog(): void {
    this.createDialogVisible = false;
  }

  onMemorySelectionChange(event: any) {
    console.log(this.selectedMemoryId);
    this.currentMemory =
      this.memories.find((memory) => memory.id === this.selectedMemoryId) ??
      this.currentMemory;
  }

  onMemoryFilter($event: ListboxFilterEvent): void {
    console.log('memory filter');
    this.filterValue = $event.filter;
  }

  get() {
    this.memoriesService.get().subscribe((data) => {
      this.memories = data;
      console.log(this.memories);
    });
  }

  onVideoEnded(secondVideoplayer: HTMLVideoElement) {
    if (this.doRepeat) {
      secondVideoplayer.currentTime = 0;
      secondVideoplayer.play();
      return;
    }

    this.playNext();
  }

  @HostListener('window:keydown.ArrowRight', ['$event'])
  playNext() {
    if (!this.roundRobin.getLength()) {
      return;
    }

    this.currentMemorySource = this.roundRobin.getNext();

    this.switchPlayerSource();
  }

  @HostListener('window:keydown.ArrowLeft', ['$event'])
  playPrevious() {
    if (!this.roundRobin.getLength()) {
      return;
    }

    this.currentMemorySource = this.roundRobin.getPrevious();

    this.switchPlayerSource();
  }

  switchPlayerSource() {
    if (!this.currentMemorySource?.source) {
      return;
    }

    this.videoPlayer2.nativeElement.src = this.currentMemorySource.source;

    this.videoPlayer2.nativeElement.load();

    this.videoPlayer2.nativeElement.play();
  }

  start() {
    if (!this.memories.length) {
      return;
    }

    if (!this.selectedMemoryId) {
      this.selectedMemoryId = this.memories[0].id;
    }

    this.memoriesService.getSources(this.selectedMemoryId).subscribe((data) => {
      console.log(data);

      if (data?.length < 1) {
        return;
      }

      this.roundRobin = new RoundRobin([]);
      this.currentMemorySource = new MemorySourceModel();

      if (data.length === 1) {
        data.push(data[0]);
      }

      data.forEach((memoryPart) => {
        this.roundRobin.add({
          ...memoryPart,
        });
      });

      this.videoPlayer2.nativeElement.muted = this.muted;
      this.videoPlayer2.nativeElement.style.display = 'inline-block';

      this.playNext();
    });
  }

  error(error: unknown) {
    console.log('error', error);
    setTimeout(() => this.playNext(), 3000);
  }

  updateSourceName(
    $event: MouseEvent,
    closeCallback: (event: MouseEvent) => void,
  ): void {
    console.log($event);
    this.memoriesService
      .updateSources([this.currentMemorySource])
      .subscribe((data) => {
        console.log(data);
      });
    closeCallback($event);
  }

  deleteSource(): void {
    this.memoriesService
      .deleteSources([this.currentMemorySource])
      .subscribe((data) => {
        console.log(data);
        const currentIndex = this.roundRobin.getCurrentIndex();
        this.playNext();
        this.roundRobin.remove(currentIndex);
      });
  }
}
