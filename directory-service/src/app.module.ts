import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DirectoryController } from "./controllers/directory.controller";
import { DirectoryService } from "./services";
import { DiscoveryModule } from "@nestjs/core";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    DiscoveryModule,
    ClientsModule.register([
      {
        name: "MEDIA_CLIENT",

        transport: Transport.RMQ,
        options: {
          urls: ["amqp://localhost:5672"], // Your RabbitMQ server URL
          queue: "media_queue", // The queue to which you'll send messages
          queueOptions: {
            durable: false, // Optional: make the queue durable
          },
          noAck: false,
        },
      },
    ]),
  ],
  controllers: [AppController, DirectoryController],
  providers: [AppService, DirectoryService],
})
export class AppModule {}
