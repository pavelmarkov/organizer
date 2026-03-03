import { Observable } from "rxjs";
import { NotificationsService } from "../services/notifications/notifications.service";

import { Sse, Controller } from "@nestjs/common";

@Controller()
export class NotificationsController {
  constructor(private notificationService: NotificationsService) {}

  @Sse("notifications")
  async sendNotification(): Promise<Observable<any>> {
    return await this.notificationService.handleConnection();
  }
}
