import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SelectedNodesType } from '../../core/types';

@Injectable({ providedIn: 'root' })
export class DataService {
  private selectedNodes: BehaviorSubject<SelectedNodesType> =
    new BehaviorSubject<SelectedNodesType>({});
  currentSelectedNodes = this.selectedNodes.asObservable();

  constructor() {}

  changeData(data: SelectedNodesType) {
    this.selectedNodes.next(data);
  }
}
