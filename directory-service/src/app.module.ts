import { Module, OnModuleInit } from "@nestjs/common";
import { DirectoryModule } from "./services/directory";
import { MikroORM, SqliteDriver } from "@mikro-orm/sqlite";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { SeedManager } from "@mikro-orm/seeder";
import { DirectorySeeder } from "./persistence";

@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: ["./dist/entities"],
      entitiesTs: ["./src/entities"],
      dbName: "organizer.sqlite3",
      driver: SqliteDriver,
      extensions: [SeedManager],
    }),
    DirectoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    await this.orm.schema.updateSchema();
    await this.orm.seeder.seed(DirectorySeeder);
  }
}
