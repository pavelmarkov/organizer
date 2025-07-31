import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { MediaService } from "./media.service";
import { MEDIA_SERVICE_CLIENT } from "../../consts/infrastructure";
import { ConfigModule, ConfigService } from "../../shared/config";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MEDIA_SERVICE_CLIENT,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
          const mediaServiceConfig = (await configService.getConfig())
            .mediaService;
          return mediaServiceConfig;
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [],
  providers: [MediaService, ConfigService],
  exports: [MediaService],
})
export class MediaModule {}
