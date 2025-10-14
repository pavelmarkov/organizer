import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { SelectedNodesType } from '../../core/types';

import { ButtonModule } from 'primeng/button';
import { TreeNodeExpandEvent } from 'primeng/tree';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'tree-table-layout',
  imports: [TreeTableModule, CommonModule, ButtonModule],
  templateUrl: './tree-table-layout.component.html',
  styleUrl: './tree-table-layout.component.css',
})
export class TreeTableLayoutComponent implements OnInit {
  @Input() selectionKeys: SelectedNodesType = {};

  @Input() dataKeyName!: string;

  @Input() rows!: TreeNode[];

  @Input() columns!: Column[];

  @Input() totalRecords!: number;

  @Input() loading: boolean = false;

  @Output() nodeExpandEvent = new EventEmitter<TreeNode>();

  @Output() showDialogEvent = new EventEmitter<TreeNode['data']>();

  @Output() loadNodesEvent = new EventEmitter<void>();

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {}

  loadNodes($event: any) {
    this.loadNodesEvent.emit();
    this.cd.markForCheck();
  }

  onNodeExpand(event: TreeNodeExpandEvent) {
    this.nodeExpandEvent.emit(event.node);
  }

  showDialog(event: any) {
    this.showDialogEvent.emit(event);
  }
}
