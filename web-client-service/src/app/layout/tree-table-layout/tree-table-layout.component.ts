import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { TreeTableModule } from 'primeng/treetable';
import { ConfirmationService, TreeNode } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { SelectedNodesType } from '../../core/types';

import { ButtonModule } from 'primeng/button';
import { TreeNodeExpandEvent } from 'primeng/tree';
import { PaginatorState } from 'primeng/paginator';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'tree-table-layout',
  templateUrl: './tree-table-layout.component.html',
  styleUrl: './tree-table-layout.component.css',
  imports: [TreeTableModule, CommonModule, ButtonModule, ConfirmDialogModule],
  providers: [ConfirmationService],
})
export class TreeTableLayoutComponent implements OnInit {
  private confirmationService = inject(ConfirmationService);

  @Input() selectionKeys: SelectedNodesType = {};

  @Input() dataKeyName!: string;

  @Input() rows!: TreeNode[];

  @Input() columns!: Column[];

  @Input() totalRecords!: number;

  @Input() loading: boolean = false;

  @Output() nodeExpandEvent = new EventEmitter<TreeNode>();

  @Output() showDialogEvent = new EventEmitter<TreeNode['data']>();

  @Output() loadNodesEvent = new EventEmitter<void>();

  @Output() paginationEvent = new EventEmitter<PaginatorState>();

  @Output() editEvent = new EventEmitter<TreeNode['data']>();

  @Output() removeEvent = new EventEmitter<TreeNode['data']>();

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {}

  onPage($event: PaginatorState) {
    this.paginationEvent.emit($event);
  }

  loadNodes($event: any) {
    this.loadNodesEvent.emit();
    // this.cd.markForCheck();
  }

  onNodeExpand(event: TreeNodeExpandEvent) {
    this.nodeExpandEvent.emit(event.node);
  }

  showDialog(event: any) {
    this.showDialogEvent.emit(event);
  }

  edit(event: any) {
    this.editEvent.emit(event);
  }

  remove(event: TreeNode['data']) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: `Deleting ${event.name}`,
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },

      accept: () => {
        this.removeEvent.emit(event);
      },
      reject: () => {},
    });
  }
}
