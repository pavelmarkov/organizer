export enum SourceTypes {}

export interface View {
  rowIdentifier: string;
  title: string;
  subtitle: string;
  image: string;
  text: string;
  tags: string[];
  next: string;
  previous: string;
  details: string;
  attachments: {
    type?: SourceTypes;
    source: string;
  }[];
}
