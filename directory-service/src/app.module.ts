import { MiddlewareConsumer, Module, OnModuleInit } from "@nestjs/common";
import {
  ConnectionsModule,
  DirectoryModule,
  NoteModule,
  ProjectsModule,
  TagsModule,
  MemoriesModule,
} from "./services";
import { MikroORM } from "@mikro-orm/sqlite";
import { SqliteDriver } from "@mikro-orm/sqlite";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { SeedManager } from "@mikro-orm/seeder";
import { DirectorySeeder } from "./persistence";
import {
  ConnectionsController,
  DirectoryController,
  NoteController,
  ProjectsController,
  TagsController,
  MemoriesController,
} from "./controllers";
import { AsyncLocalStorageModule } from "./storage/async-local-storage.module";
import { AsyncLocalStorage } from "node:async_hooks";

const CONTROLLERS = [
  DirectoryController,
  NoteController,
  ProjectsController,
  TagsController,
  ConnectionsController,
  MemoriesController,
];

@Module({
  imports: [
    AsyncLocalStorageModule,
    MikroOrmModule.forRoot({
      entities: ["./dist/entities"],
      entitiesTs: ["./src/entities"],
      dbName: "organizer.sqlite3",
      driver: SqliteDriver,
      extensions: [SeedManager],
    }),
    DirectoryModule,
    NoteModule,
    ProjectsModule,
    TagsModule,
    ConnectionsModule,
    MemoriesModule,
  ],
  providers: [DirectoryModule, NoteModule, ProjectsModule],
  controllers: CONTROLLERS,
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly orm: MikroORM,
    private readonly asyncLocalStorage: AsyncLocalStorage<any>
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        const store = {
          projectId: req.headers["projectid"],
          searchValue: req.headers["searchvalue"]
            ? decodeURI(req.headers["searchvalue"])
            : null,
        };
        this.asyncLocalStorage.run(store, () => next());
      })
      .forRoutes("*");
  }

  async onModuleInit(): Promise<void> {
    await this.orm.schema.updateSchema();
    await this.orm.seeder.seed(DirectorySeeder);
  }
}
