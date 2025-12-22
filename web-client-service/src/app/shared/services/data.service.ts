import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ComponentMessageType, SelectedNodesType } from '../../core/types';

@Injectable({ providedIn: 'root' })
export class DataService {
  private project = new Subject<string>();
  currentProject = this.project.asObservable();

  private searchValue = new Subject<string>();
  currentSearchValue = this.searchValue.asObservable();

  private selectedNodes = new Subject<SelectedNodesType>();
  currentSelectedNodes = this.selectedNodes.asObservable();

  constructor() {}

  setProject(data: string) {
    this.project.next(data);
  }

  setSearchValue(data: string) {
    this.searchValue.next(data);
  }

  setSelectedNodes(data: SelectedNodesType) {
    this.selectedNodes.next(data);
  }
}
