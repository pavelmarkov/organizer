import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ConnectionsService, DirectoryService } from '../../core/services';
import { CardModel, DirectoryModel } from '../../core/domain';
import { DataService } from '../../shared/services/data.service';
import { SelectedNodesType } from '../../core/types';

import { ButtonModule } from 'primeng/button';
import { ActionsLayoutComponent } from '../actions-layout/actions-layout.component';

import { CardLayoutComponent } from '../card-layout/card-layout.component';

interface Column {
  field: keyof DirectoryModel | '';
  header: string;
}

@Component({
  selector: 'app-directory-layout',
  imports: [
    ActionsLayoutComponent,
    TreeTableModule,
    CommonModule,
    ButtonModule,
    CardLayoutComponent,
  ],
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

  dialogPanelVisible: boolean = false;

  cardData: CardModel = {
    rowIdentifier: null,
    tags: [],
  };

  constructor(
    private cd: ChangeDetectorRef,
    private directoryService: DirectoryService,
    private connectionsService: ConnectionsService,
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

    this.dataService.currentImportedDirectory.subscribe((data) => {
      console.log(data.message);
      this.loadNodes(null);
    });

    this.dataService.currentProject.subscribe((data) => {
      this.loadNodes(null);
    });

    this.dataService.currentSearchValue.subscribe((data) => {
      this.loadNodes(null);
    });
  }

  private mapDirectoriesToNodes(directories: DirectoryModel[]): TreeNode[] {
    const nodes: TreeNode[] = [];

    directories.forEach((directoryElement) => {
      let node: TreeNode = {
        data: directoryElement,
        leaf: !directoryElement.isFolder,
        children: [],
      };

      nodes.push(node);
    });

    return nodes;
  }

  loadNodes(event: any) {
    this.loading = true;

    this.directoryService.getDirectory({}).subscribe((directories) => {
      const nodes = this.mapDirectoriesToNodes(directories);
      console.log(nodes);
      this.files = [...nodes];
      this.loading = false;
      this.totalRecords = nodes.length;
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
        node.children = this.mapDirectoriesToNodes(nodeChildren);
        this.files = [...this.files];
        this.loading = false;
        this.cd.markForCheck();
      });
  }

  nodeSelect(event: any) {
    this.dataService.changeData(this.selectionKeys);
  }

  showDialog(directory: DirectoryModel) {
    this.directoryService.view(directory.directoryId).subscribe((viewData) => {
      this.cardData = viewData;
      this.dialogPanelVisible = true;
    });
  }

  nextItem(directory: DirectoryModel) {
    if (!this.cardData.next) {
      return;
    }

    this.directoryService.view(this.cardData.next).subscribe((viewData) => {
      this.cardData = viewData;
      this.dialogPanelVisible = true;
    });
  }

  previousItem(directory: DirectoryModel) {
    if (!this.cardData.previous) {
      return;
    }

    this.directoryService.view(this.cardData.previous).subscribe((viewData) => {
      this.cardData = viewData;
      this.dialogPanelVisible = true;
    });
  }

  closeDialog() {
    this.dialogPanelVisible = false;
  }

  tagChanged(selectedTags: string[]) {
    if (!this.cardData.rowIdentifier) {
      return;
    }

    this.directoryService
      .update([
        {
          directoryId: this.cardData.rowIdentifier,
          tags: selectedTags,
        },
      ])
      .subscribe((data) => {
        console.log(data);
        this.cardData.tags = selectedTags;
      });
  }
}
