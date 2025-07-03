import { Injectable } from "@nestjs/common";
import { GetDirectoryResponseDto } from "../dtos";

@Injectable()
export class DirectoryService {
  getDirectory(): GetDirectoryResponseDto {
    return {
      directory: [],
    };
  }
}
