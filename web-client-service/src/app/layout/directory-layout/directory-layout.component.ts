import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { TreeTableModule } from 'primeng/treetable';
import { TreeNode, TreeTableNode } from 'primeng/api';
import { CommonModule } from '@angular/common';
import {
  ConnectionsService,
  DirectoryService,
  MemoriesService,
} from '../../core/services';
import { CardModel, DirectoryModel } from '../../core/domain';
import { DataService } from '../../shared/services/data.service';
import { SelectedNodesType } from '../../core/types';

import { ButtonModule } from 'primeng/button';
import { ActionsLayoutComponent } from '../actions-layout/actions-layout.component';

import { CardLayoutComponent } from '../card-layout/card-layout.component';
import { ImportDirectoryStructureRequestDto } from '../../core/dtos';
import { TreeTableLayoutComponent } from '../tree-table-layout/tree-table-layout.component';
import { PaginatorState } from 'primeng/paginator';

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
    TreeTableLayoutComponent,
  ],
  templateUrl: './directory-layout.component.html',
  styleUrl: './directory-layout.component.css',
})
export class DirectoryLayoutComponent implements OnInit {
  dataKeyName: string = 'directoryId';

  selectionKeys: SelectedNodesType = {};

  files!: TreeNode[];

  cols!: Column[];

  totalRecords!: number;

  loading: boolean = false;

  dialogPanelVisible: boolean = false;

  cardData: CardModel = {
    rowIdentifier: null,
    tags: [],
  };

  limit: number = 10;
  offset: number = 0;

  constructor(
    private cd: ChangeDetectorRef,
    private directoryService: DirectoryService,
    private connectionsService: ConnectionsService,
    private dataService: DataService,
    private memoriesService: MemoriesService
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

    this.dataService.currentProject.subscribe((data) => {
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

    this.directoryService
      .getDirectory({}, { offset: this.offset, limit: this.limit })
      .subscribe((directories) => {
        const nodes = this.mapDirectoriesToNodes(directories);
        console.log(nodes);
        this.files = [...nodes];
        this.loading = false;
        this.cd.markForCheck();
      });
    this.getTotalCount();
  }

  getTotalCount() {
    this.directoryService.count().subscribe((data) => {
      this.totalRecords = data;
    });
  }

  paginate($event: PaginatorState) {
    this.limit = $event.rows ?? 10;
    this.offset = $event.first ?? 0;
    this.loadNodes($event);
  }

  onNodeExpand(node: TreeNode) {
    this.loading = true;
    const nodeId = node.data.directoryId;

    this.directoryService
      .getDirectory({ parentId: nodeId }, {})
      .subscribe((nodeChildren) => {
        console.log(nodeChildren);
        node.children = this.mapDirectoriesToNodes(nodeChildren);
        this.loading = false;
        this.files = [...this.files];
        this.cd.markForCheck();
      });
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

  processDirectory() {
    const selectedDirectoryGuids = Object.keys(this.selectionKeys).filter(
      (guid) => this.selectionKeys[guid].checked
    );

    this.directoryService
      .processDirectory(selectedDirectoryGuids)
      .subscribe((processingNodes) => {
        console.log(processingNodes);
      });
  }

  importDirectoryFromFile(fileContent: string) {
    console.log('import from directory layout');
    const directoryStructure: ImportDirectoryStructureRequestDto =
      JSON.parse(fileContent);
    this.directoryService
      .importDirectory(directoryStructure.data)
      .subscribe((importResult) => {
        console.log('import result ', importResult);
        this.loadNodes(null);
      });
  }

  searchDirectory() {
    this.loadNodes(null);
  }

  generateMemory() {
    console.log('calling generateMemory');
    const selectedDirectoryGuids = Object.keys(this.selectionKeys).filter(
      (guid) => this.selectionKeys[guid].checked
    );
    this.memoriesService.generate(selectedDirectoryGuids).subscribe((data) => {
      console.log(data);
    });
  }
}
