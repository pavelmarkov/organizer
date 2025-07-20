import { DirectoryModel } from '../../domain';

interface DirectoryNodeDto {
  data: DirectoryModel[];
  leaf: boolean;
  children: DirectoryNodeDto[];
}

export interface GetDirectoryResponseDto {
  directory: DirectoryNodeDto[];
}
