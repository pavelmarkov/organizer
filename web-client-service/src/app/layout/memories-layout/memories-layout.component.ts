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

@Component({
  selector: 'app-memories-layout',
  imports: [CommonModule, CardModule, PanelModule, ActionsLayoutComponent],
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
    private memoriesService: MemoriesService
  ) {}

  muted: boolean = true;

  roundRobin: RoundRobin = new RoundRobin([]);

  ngOnInit() {}

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

  start() {
    this.memoriesService.get().subscribe((data) => {
      this.roundRobin = new RoundRobin([]);

      if (data?.length < 1) {
        return;
      }

      if (data.length === 1) {
        data.push(data[0]);
      }

      data.forEach((path) => {
        this.roundRobin.add(this.memoriesService.getStreamUrl(path));
      });

      this.videoPlayer2.nativeElement.src = this.roundRobin.getNext();
      this.videoPlayer2.nativeElement.load();

      this.playNext(
        this.videoPlayer2.nativeElement,
        this.videoPlayer1.nativeElement
      );
    });
  }

  error(
    error: unknown,
    videoplayer: HTMLVideoElement,
    secondVideoplayer: HTMLVideoElement
  ) {
    console.log('error', error);
    setTimeout(() => this.playNext(videoplayer, secondVideoplayer), 3000);
  }
}
