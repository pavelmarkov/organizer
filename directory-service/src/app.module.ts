import { MiddlewareConsumer, Module, OnModuleInit } from "@nestjs/common";
import { DirectoryModule, NoteModule, ProjectsModule } from "./services";
import { MikroORM, SqliteDriver } from "@mikro-orm/sqlite";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { SeedManager } from "@mikro-orm/seeder";
import { DirectorySeeder } from "./persistence";
import {
  DirectoryController,
  NoteController,
  ProjectsController,
} from "./controllers";
import { AsyncLocalStorageModule } from "./storage/async-local-storage.module";
import { AsyncLocalStorage } from "node:async_hooks";

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
  ],
  providers: [DirectoryModule, NoteModule, ProjectsModule],
  controllers: [DirectoryController, NoteController, ProjectsController],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly orm: MikroORM,
    private readonly asyncLocalStorage: AsyncLocalStorage<any>
  ) {}

  configure(consumer: MiddlewareConsumer) {
    // bind the middleware,
    consumer
      .apply((req, res, next) => {
        // populate the store with some default values
        // based on the request,
        const store = {
          projectId: req.headers["projectid"],
        };
        // and pass the "next" function as callback
        // to the "als.run" method together with the store.
        this.asyncLocalStorage.run(store, () => next());
      })
      .forRoutes("*");
  }

  async onModuleInit(): Promise<void> {
    await this.orm.schema.updateSchema();
    await this.orm.seeder.seed(DirectorySeeder);
  }
}
