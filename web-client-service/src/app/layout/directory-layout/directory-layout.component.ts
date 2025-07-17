import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../config/environment';

interface Column {
  field: string;
  header: string;
}

interface DirectoryNodeDataDto {
  name: string;
  size: string;
  type: string;
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
      { field: 'type', header: 'Type' },
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

    this.http
      .get<GetDirectoryResponseDto>(`${this.baseUrl}/directory`)
      .subscribe((nodeChildren) => {
        console.log(nodeChildren);
        node.children = nodeChildren.directory;
        this.files = [...this.files];
        this.loading = false;
        this.cd.markForCheck();
      });
  }
}
