import { View } from "../../domain/types";

export class ViewDto implements View {
  title: string;
  subtitle: string;
  image: string;
  text: string;
  tags: string[];
}
