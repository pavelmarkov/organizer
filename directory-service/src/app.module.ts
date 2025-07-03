import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DirectoryController } from "./controllers/directory.controller";
import { DirectoryService } from "./services";
import { DiscoveryModule } from "@nestjs/core";

@Module({
  imports: [DiscoveryModule],
  controllers: [AppController, DirectoryController],
  providers: [AppService, DirectoryService],
})
export class AppModule {}
