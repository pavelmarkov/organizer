class DirectoryElementDto {
  name: string;
  size: string;
  type: string;
}

export class GetDirectoryResponseDto {
  directory: DirectoryElementDto[];
}
