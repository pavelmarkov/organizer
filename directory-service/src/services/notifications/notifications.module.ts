import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { NotificationsService } from "./notifications.service";

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [] })],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
