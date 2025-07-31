import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
