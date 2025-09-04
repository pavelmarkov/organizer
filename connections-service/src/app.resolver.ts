import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Args, Query, Resolver } from "@nestjs/graphql";

import { Field, Int, ObjectType } from "@nestjs/graphql";
import { driver as neo4jDriver, auth as neo4jAuth } from "neo4j-driver";

import { format as formatUrl } from "node:url";
import { GraphDatabaseService } from "./graph-database/graph-database.service";

@ObjectType()
export class Author {
  @Field((type) => Int)
  id: number;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;
}

@Injectable()
@Resolver()
export class AppResolver {
  constructor(private readonly graphDatabaseService: GraphDatabaseService) {}

  @Query(() => Author)
  async getAuthor(
    @Args("id", { type: () => Int }) id: number
  ): Promise<Author> {
    const serverInfo = await this.graphDatabaseService.getServerInfo();
    console.log(serverInfo);

    return { id: 1 };
  }
}
