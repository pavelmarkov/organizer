class DirectoryNodeDataDto {
  name: string;
  size: string;
  type: string;
}

class DirectoryNodeDto {
  data: DirectoryNodeDataDto;
  leaf: boolean;
  children: DirectoryNodeDto[];
}

export class GetDirectoryResponseDto {
  directory: DirectoryNodeDto[];
}
