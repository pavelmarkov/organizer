import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  driver as neo4jDriver,
  auth as neo4jAuth,
  Driver,
  ServerInfo,
  Neo4jError,
} from "neo4j-driver";
import { format as formatUrl } from "node:url";
import { ConfigurationType } from "src/config/configuration.type";
import { DATABASE_CONNECTION_RETRY_DELAY } from "src/const";

@Injectable()
export class GraphDatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(GraphDatabaseService.name);
  private driver: Driver;
  private databaseConfig: ConfigurationType["database"] | undefined;
  constructor(private configService: ConfigService) {
    this.databaseConfig = this.configService.get("database");
  }

  async connectToDatabase(): Promise<void> {
    if (!this.databaseConfig) {
      this.logger.error("No database config provided");
      return;
    }
    const neo4jUrl = formatUrl({
      protocol: this.databaseConfig.schema,
      slashes: true,
      hostname: this.databaseConfig.host,
      port: this.databaseConfig.port,
    });

    this.driver = neo4jDriver(
      neo4jUrl,
      neo4jAuth.basic(
        this.databaseConfig.username,
        this.databaseConfig.password
      )
    );

    try {
      await this.driver.verifyAuthentication();
    } catch (error: unknown) {
      const errorMessages: string[] = ["Error connection to graph database"];
      if (error instanceof Neo4jError) {
        errorMessages.push(error.cause?.message ?? "");
      }
      this.logger.error(errorMessages.join("; "));
      setTimeout(
        () => this.connectToDatabase(),
        DATABASE_CONNECTION_RETRY_DELAY
      );
      return;
    }

    const serverInfo = await this.driver.getServerInfo();
    this.logger.log("Connection with graph db established");
    this.logger.log(serverInfo);
  }

  async onModuleInit(): Promise<void> {
    await this.connectToDatabase();
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
