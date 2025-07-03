import { Injectable } from "@nestjs/common";
import { DiscoveryService } from "@nestjs/core";

@Injectable()
export class AppService {
  constructor(private readonly discoveryService: DiscoveryService) {}
  getHello(): string {
    // const providers = this.discoveryService.getProviders();
    // console.log(providers);

    const controllers = this.discoveryService.getControllers();
    controllers.forEach((controller) => {
      if (controller.name !== "DirectoryController") {
        return;
      }
      console.log(controller.name);
      console.log(controller);
    });

    return "Hello World!";
  }
}
