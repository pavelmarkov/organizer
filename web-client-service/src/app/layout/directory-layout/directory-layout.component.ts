import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../config/environment';

interface DirectoryNodeDataDto {
  directoryId: string;
  parentId: string;
  name: string;
  isFolder: boolean;
  fileType: string;
  size: number;
}

interface Column {
  field: keyof DirectoryNodeDataDto;
  header: string;
}

interface DirectoryNodeDto {
  data: DirectoryNodeDataDto;
  leaf: boolean;
  children: DirectoryNodeDto[];
}

interface GetDirectoryResponseDto {
  directory: DirectoryNodeDto[];
}

@Component({
  selector: 'app-directory-layout',
  imports: [TreeTableModule, CommonModule],
  templateUrl: './directory-layout.component.html',
  styleUrl: './directory-layout.component.css',
})
export class DirectoryLayoutComponent implements OnInit {
  private baseUrl: string = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);

  files!: TreeNode[];

  cols!: Column[];

  totalRecords!: number;

  loading: boolean = false;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'size', header: 'Size' },
      { field: 'fileType', header: 'Type' },
    ];

    this.totalRecords = 0;

    this.loading = true;
  }

  loadNodes(event: any) {
    this.loading = true;

    this.http
      .get<GetDirectoryResponseDto>(`${this.baseUrl}/directory`)
      .subscribe((nodes) => {
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

    let params = new HttpParams();
    params = params.set('parentId', nodeId);

    this.http
      .get<GetDirectoryResponseDto>(`${this.baseUrl}/directory`, {
        params,
      })
      .subscribe((nodeChildren) => {
        console.log(nodeChildren);
        node.children = nodeChildren.directory;
        this.files = [...this.files];
        this.loading = false;
        this.cd.markForCheck();
      });
  }
}
