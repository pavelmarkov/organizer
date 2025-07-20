export interface DirectoryModel {
  directoryId: string;
  parentId: string;
  name: string;
  isFolder: boolean;
  fileType: string;
  size: number;
}
