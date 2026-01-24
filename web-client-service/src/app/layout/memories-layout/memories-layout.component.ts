import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { ActionsLayoutComponent } from '../actions-layout/actions-layout.component';
import { MemoriesService } from '../../core/services';
import { CommonModule } from '@angular/common';
import { RoundRobin } from './utils/round-robin';
import { MemoriesModel } from '../../core/domain';
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
    InputTextModule,
    TextareaModule,
    CommonModule,
  ],
  providers: [MessageService],
  templateUrl: './memories-layout.component.html',
  styleUrl: './memories-layout.component.css',
})
export class MemoriesLayoutComponent {
  @ViewChild('videoPlayer1') videoPlayer1: ElementRef<HTMLVideoElement> =
    new ElementRef<HTMLVideoElement>({} as HTMLVideoElement);
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
  filterValue: string | null = null;

  createDialogVisible: boolean = false;

  items!: MenuItem[];

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

  view(): void {}
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

  playNext(videoplayer: HTMLVideoElement, secondVideoplayer: HTMLVideoElement) {
    secondVideoplayer.src = this.roundRobin.getNext();
    secondVideoplayer.load();

    videoplayer.pause();
    videoplayer.style.display = 'none';

    secondVideoplayer.muted = videoplayer.muted;
    secondVideoplayer.play();
    secondVideoplayer.style.display = 'inline-block';
    // secondVideoplayer.style.height = '98vh';
    // secondVideoplayer.style.maxWidth = '100%';
  }

  chooseMemory($event: any) {
    console.log($event);
  }

  start() {
    console.log('selectedMemoryId: ', this.selectedMemoryId);
    this.memoriesService.getSources(this.selectedMemoryId).subscribe((data) => {
      console.log(data);

      if (data?.length < 1) {
        return;
      }

      this.roundRobin = new RoundRobin([]);

      if (data.length === 1) {
        data.push(data[0]);
      }

      data.forEach((path) => {
        this.roundRobin.add(this.memoriesService.getStreamUrl(path));
      });

      this.videoPlayer1.nativeElement.muted = this.muted;
      this.videoPlayer2.nativeElement.muted = this.muted;

      this.videoPlayer2.nativeElement.src = this.roundRobin.getNext();
      this.videoPlayer2.nativeElement.load();

      this.playNext(
        this.videoPlayer2.nativeElement,
        this.videoPlayer1.nativeElement,
      );
    });
  }

  error(
    error: unknown,
    videoplayer: HTMLVideoElement,
    secondVideoplayer: HTMLVideoElement,
  ) {
    console.log('error', error);
    setTimeout(() => this.playNext(videoplayer, secondVideoplayer), 3000);
  }
}
