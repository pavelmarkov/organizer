import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  driver as neo4jDriver,
  auth as neo4jAuth,
  Driver,
  ServerInfo,
} from "neo4j-driver";
import { format as formatUrl } from "node:url";

@Injectable()
export class GraphDatabaseService implements OnModuleInit, OnModuleDestroy {
  private driver: Driver;
  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const config = this.configService.get("database");
    const neo4jUrl = formatUrl({
      protocol: config.schema,
      slashes: true,
      hostname: config.host,
      port: config.port,
    });

    this.driver = neo4jDriver(
      neo4jUrl,
      neo4jAuth.basic(config.username, config.password)
    );

    const serverInfo = await this.driver.getServerInfo();
    console.log("Connection with graph db established");
    console.log(serverInfo);
  }

  async onModuleDestroy() {
    await this.driver.close();
  }

  async getServerInfo(): Promise<ServerInfo> {
    return await this.driver.getServerInfo();
  }

  getDriver(): Driver {
    return this.driver;
  }
}
