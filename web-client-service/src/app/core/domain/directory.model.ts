export interface DirectoryModel {
  directoryId: string;
  parentId: string | null;
  name: string;
  isFolder: boolean;
  fileType: string;
  size: number;
  tags: string[];
}
