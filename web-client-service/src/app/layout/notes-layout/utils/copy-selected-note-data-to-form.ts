import { TreeNode } from 'primeng/api';
import { NoteModel } from '../../../core/domain';
import { SelectedNodesType } from '../../../core/types';

const findSelectedNodeRecursively = (
  node: TreeNode<NoteModel>,
  selectedNoteIds: string[],
): NoteModel | undefined => {
  if (
    !node.children?.length &&
    selectedNoteIds.includes(node.data?.noteId ?? '')
  ) {
    return node.data;
  }

  if (node.children?.length) {
    const foundChild = node.children.find((childNode) =>
      findSelectedNodeRecursively(childNode, selectedNoteIds),
    );
    if (foundChild) {
      return foundChild.data;
    }
  }

  if (selectedNoteIds.includes(node.data?.noteId ?? '')) {
    return node.data;
  }

  return undefined;
};

export const copySelectedNoteData = (
  selectionKeys: SelectedNodesType<NoteModel>,
): Partial<NoteModel> => {
  const note: Partial<NoteModel> = {};

  if (selectionKeys.length < 1) {
    return note;
  }

  const selectedNote: Partial<NoteModel> | undefined = selectionKeys[0].data;

  if (selectedNote) {
    note.parentId = selectedNote.parentId;
    note.name = selectedNote.name;
    note.description = selectedNote.description;
    note.type = selectedNote.type;
    note.source = selectedNote.source;
  }

  return note;
};
