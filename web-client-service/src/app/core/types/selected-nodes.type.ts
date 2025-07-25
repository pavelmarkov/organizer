export interface SelectedNodesType {
  [nodeId: string]: {
    partialChecked: boolean;
    checked: boolean;
  };
}
