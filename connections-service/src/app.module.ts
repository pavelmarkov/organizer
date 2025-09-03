import { Module } from "@nestjs/common";
import { AppResolver } from "./app.resolver";

import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: "src/schema/schema.graphql",
    }),
  ],
  controllers: [],
  providers: [AppResolver],
})
export class AppModule {}
