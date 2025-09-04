import { Module } from "@nestjs/common";
import { GraphDatabaseService } from "./graph-database.service";
import { ConfigModule } from "@nestjs/config";
@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [GraphDatabaseService],
  exports: [GraphDatabaseService],
})
export class GraphDatabaseModule {}
