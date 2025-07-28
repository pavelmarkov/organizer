import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { DirectoryService } from '../../core/services';
import { DirectoryModel } from '../../core/domain';
import { DataService } from '../../shared/services/data.service';
import { SelectedNodesType } from '../../core/types';

import { ButtonModule } from 'primeng/button';

interface Column {
  field: keyof DirectoryModel | '';
  header: string;
}

@Component({
  selector: 'app-directory-layout',
  imports: [TreeTableModule, CommonModule, ButtonModule],
  templateUrl: './directory-layout.component.html',
  styleUrl: './directory-layout.component.css',
})
export class DirectoryLayoutComponent implements OnInit {
  files!: TreeNode[];

  cols!: Column[];

  totalRecords!: number;

  loading: boolean = false;

  selectionKeys: SelectedNodesType = {};

  selected: string[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private directoryService: DirectoryService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'size', header: 'Size' },
      { field: 'fileType', header: 'Type' },
      { field: '', header: '' },
    ];

    this.totalRecords = 0;

    this.loading = true;
  }

  loadNodes(event: any) {
    this.loading = true;

    this.directoryService.getDirectory({}).subscribe((nodes) => {
      console.log(nodes);
      this.files = [...nodes.directory];
      this.loading = false;
      this.totalRecords = nodes.directory.length;
      this.cd.markForCheck();
    });
  }

  onNodeExpand(event: any) {
    this.loading = true;

    const node = event.node;
    const nodeId = node.data.directoryId;

    this.directoryService
      .getDirectory({ parentId: nodeId })
      .subscribe((nodeChildren) => {
        console.log(nodeChildren);
        node.children = nodeChildren.directory;
        this.files = [...this.files];
        this.loading = false;
        this.cd.markForCheck();
      });
  }

  nodeSelect(event: any) {
    this.dataService.changeData(this.selectionKeys);
  }
}
