import { Injectable } from "@nestjs/common";
import { ClientProvider, Transport } from "@nestjs/microservices";

@Injectable()
export class ConfigService {
  constructor() {}

  async getConfig(): Promise<{
    mediaService: ClientProvider;
    memoriesService: ClientProvider;
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
      memoriesService: {
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${process.env.RABBIT_MQ_HOST ?? "localhost"}:5672`],
          queue: "memories_queue",
          prefetchCount: 1,
          queueOptions: {
            durable: false,
            maxLength: 1000000,
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
