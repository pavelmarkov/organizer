export interface NoteModel {
  noteId: string;
  parentId: string | null;
  name: string;
  description: string;
  type: string | 'folder';
  source: string;
  tags: string[];
  sortOrder: number;
}
