import { Injectable } from "@nestjs/common";
import { GetDirectoryResponseDto } from "../dtos";

@Injectable()
export class DirectoryService {
  getDirectory(): GetDirectoryResponseDto {
    const directory: GetDirectoryResponseDto["directory"] = [];

    for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
      let node = {
        data: {
          name: "Item " + (1 + i),
          size: Math.floor(Math.random() * 1000) + 1 + "kb",
          type: "Type " + (1 + i),
        },
        leaf: Math.random() < 0.5,
        children: [],
      };

      directory.push(node);
    }
    return {
      directory,
    };
  }
}
