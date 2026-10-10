import { LOG_LEVELS, Logger, Module } from "@nestjs/common";

import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "./config/configuration";

import neo4j, { logging } from "neo4j-driver";
import { Neo4jGraphQL, Neo4jGraphQLConstructor } from "@neo4j/graphql";

import fs from "fs";
import path from "path";
import { resolveUpdateNotesConnections } from "./resolvers";
import { SCHEMA_MIGRATIONS } from "./migrations";

const typeDefs = fs.readFileSync(
  path.join(__dirname, "./schema/schema.graphql"),
  "utf-8",
);

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger(GraphQLModule.name);

        const [uriSchema, host, port] = [
          configService.getOrThrow("database.schema"),
          configService.getOrThrow("database.host"),
          configService.getOrThrow("database.port"),
        ];

        const driver = neo4j.driver(
          `${uriSchema}://${host}:${port}`,
          neo4j.auth.basic(
            configService.getOrThrow("database.username"),
            configService.getOrThrow("database.password"),
          ),
          {
            logging: {
              level: "debug",
              logger: (level: string, message: string) => {
                logger.log(message);
              },
            },
          },
        );

        const customResolvers: Neo4jGraphQLConstructor["resolvers"] = [
          {
            Mutation: {
              resolveUpdateNotesConnections: async (_, args) => {
                console.dir(args, { depth: null });
                await resolveUpdateNotesConnections(driver, args.args);
                return true;
              },
            },
          },
        ];

        const neoSchema = new Neo4jGraphQL({
          typeDefs,
          driver,
          resolvers: customResolvers,
        });

        const schema = await neoSchema.getSchema();
        await neoSchema.assertIndexesAndConstraints();

        const session = driver.session();
        try {
          for (const statement of SCHEMA_MIGRATIONS) {
            await session.run(statement);
          }
        } finally {
          await session.close();
        }

        return {
          schema,
          playground: true,
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
