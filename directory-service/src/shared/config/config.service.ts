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
          urls: [`amqp://${process.env.RABBIT_MQ_HOST ?? "localhost"}:5672`],
          queue: "media_queue",
          queueOptions: {
            durable: false,
            arguments: {
              "x-max-length": 1000000,
            },
          },
          noAck: true,
        },
      },
      mediaServiceHttp: {
        host: process.env.MEDIA_SERVICE_HTTP_HOST ?? "localhost",
        port: 8000,
      },
    };
  }
}
