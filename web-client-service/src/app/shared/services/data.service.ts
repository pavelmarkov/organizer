import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ComponentMessageType, SelectedNodesType } from '../../core/types';

@Injectable({ providedIn: 'root' })
export class DataService {
  private selectedNodes: BehaviorSubject<SelectedNodesType> =
    new BehaviorSubject<SelectedNodesType>({});
  currentSelectedNodes = this.selectedNodes.asObservable();

  private importedDirectory = new Subject<ComponentMessageType>();
  currentImportedDirectory = this.importedDirectory.asObservable();

  constructor() {}

  changeData(data: SelectedNodesType) {
    this.selectedNodes.next(data);
  }

  importDirectoryFinished(data: ComponentMessageType) {
    this.importedDirectory.next(data);
  }
}
