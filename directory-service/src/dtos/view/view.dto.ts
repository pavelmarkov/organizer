import { View } from "../../domain/types";

export class ViewDto implements View {
  rowIdentifier: string;
  title: string;
  subtitle: string;
  image: string;
  text: string;
  tags: string[];
  next: string;
  previous: string;
  details: string;
}
