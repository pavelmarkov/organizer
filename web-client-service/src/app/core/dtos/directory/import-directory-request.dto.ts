interface ImportDirectoryStructureDtoData {
  path: string;
  isFolder: boolean;
}

interface ImportDirectoryStructureDtoMeta {}

export interface ImportDirectoryStructureRequestDto {
  meta: ImportDirectoryStructureDtoMeta;
  data: [ImportDirectoryStructureDtoData];
}
