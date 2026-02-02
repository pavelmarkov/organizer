export enum SourceTypes {}

export interface CardModel {
  title?: string;
  subtitle?: string;
  text?: string;
  image?: string;
  rowIdentifier: string | null;
  tags: string[];
  next?: string;
  previous?: string;
  details?: string;
  attachments: {
    type?: SourceTypes;
    source: string;
  }[];
}
