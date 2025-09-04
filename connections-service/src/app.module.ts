import { Module } from "@nestjs/common";
import { AppResolver } from "./app.resolver";

import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";
import { GraphDatabaseModule } from "./graph-database/graph-database.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: "src/schema/schema.graphql",
    }),
    GraphDatabaseModule,
  ],
  controllers: [],
  providers: [AppResolver],
})
export class AppModule {}
