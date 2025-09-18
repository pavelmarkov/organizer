import { Injectable } from "@nestjs/common";
import { ClientProvider, Transport } from "@nestjs/microservices";

@Injectable()
export class ConfigService {
  constructor() {}

  async getConfig(): Promise<{
    mediaService: ClientProvider;
    mediaServiceHttp: {
      host: string;
      port: number;
    };
  }> {
    return {
      mediaService: {
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://localhost:5672"],
          queue: "media_queue",
          queueOptions: {
            durable: false,
          },
          noAck: true,
        },
      },
      mediaServiceHttp: {
        host: "localhost",
        port: 8000,
      },
    };
  }
}
