import { Module } from "@nestjs/common";
import { DirectoryModule } from "./services/directory";

@Module({
  imports: [DirectoryModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
