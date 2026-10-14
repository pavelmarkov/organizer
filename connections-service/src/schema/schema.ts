export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CreateNoteTagConnectionInput = {
  notes: Array<NoteInput>;
};

export type Mutation = {
  __typename?: 'Mutation';
  resolveUpdateNotesConnections?: Maybe<Scalars['Boolean']['output']>;
};


export type MutationResolveUpdateNotesConnectionsArgs = {
  args: CreateNoteTagConnectionInput;
};

export type Note = {
  __typename?: 'Note';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  tags: Array<Tag>;
};

export type NoteInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  tags: Array<TagInput>;
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  notes: Array<Note>;
};

export type TagInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};
