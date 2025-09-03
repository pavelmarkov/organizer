import { Injectable } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";

import { Field, Int, ObjectType } from "@nestjs/graphql";

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
  @Query(() => Author)
  getAuthor(@Args("id", { type: () => Int }) id: number): Author {
    return { id: 1 };
  }
}
