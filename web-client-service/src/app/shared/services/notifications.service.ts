import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { NotificationSeverityEnum, NotificationType } from '../../core/types';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  baseUrl: string = 'http://localhost:3000/notifications';
  eventSource = new EventSource(this.baseUrl);

  constructor(private dataService: DataService) {}

  listenEvents(): void {
    if (this.eventSource.onmessage) {
      return;
    }

    this.eventSource.onmessage = (event: MessageEvent<string>) => {
      const message: NotificationType = JSON.parse(event.data);

      this.dataService.newNotification(message);
    };
  }
}
