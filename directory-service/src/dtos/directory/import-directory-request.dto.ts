interface ImportDirectoryStructureDtoData {
  path: string;
  isFolder: boolean;
  size: number;
}

interface ImportDirectoryStructureDtoMeta {}

export interface ImportDirectoryStructureRequestDto {
  meta: ImportDirectoryStructureDtoMeta;
  data: [ImportDirectoryStructureDtoData];
}
