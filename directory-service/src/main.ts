import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { json as expressJson } from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(expressJson({ limit: "2mb" }));

  // Then combine it with a RabbitMQ microservice
  // const microservice = app.connectMicroservice({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [`amqp://localhost:5672`],
  //     queue: "media_queue",
  //     queueOptions: { durable: false },
  //   },
  // });

  // await app.startAllMicroservices();
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
