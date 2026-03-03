import { Injectable } from "@nestjs/common";
import { Subject } from "rxjs";
import { NotificationDto } from "../../dtos";

@Injectable()
export class NotificationsService {
  notificationEvent: Subject<{ data: NotificationDto }> = new Subject();
  async handleConnection() {
    // setInterval(() => {
    //   this.notificationEvent.next({ data: { message: "Hello World" } });
    // }, 10000);
    return this.notificationEvent.asObservable();
  }

  addNotification(data: NotificationDto): void {
    this.notificationEvent.next({ data: data });
  }
}
