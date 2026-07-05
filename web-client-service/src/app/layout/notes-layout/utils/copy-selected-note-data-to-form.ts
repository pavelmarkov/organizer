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
  notes: TreeNode<NoteModel>[],
  selectionKeys: SelectedNodesType,
): Partial<NoteModel> => {
  const note: Partial<NoteModel> = {};

  const selectedNoteGuids = Object.keys(selectionKeys).filter(
    (guid) =>
      selectionKeys[guid].checked && !selectionKeys[guid].partialChecked,
  );

  if (!selectedNoteGuids.length) {
    return note;
  }

  let selectedNote: Partial<NoteModel> | undefined = {};
  notes.forEach((note) => {
    if (selectedNote?.noteId) {
      return;
    }
    selectedNote = findSelectedNodeRecursively(note, selectedNoteGuids);
  });

  if (selectedNote) {
    note.parentId = selectedNote.parentId;
    note.name = selectedNote.name;
    note.description = selectedNote.description;
    note.type = selectedNote.type;
    note.source = selectedNote.source;
  }

  return note;
};
