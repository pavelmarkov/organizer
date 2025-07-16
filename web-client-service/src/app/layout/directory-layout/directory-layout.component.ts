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

    this.totalRecords = 1000;

    this.loading = true;
  }

  loadNodes(event: any) {
    this.loading = true;

    setTimeout(() => {
      this.files = [];

      for (let i = 0; i < event.rows; i++) {
        let node = {
          data: {
            name: 'Item ' + (event.first + i),
            size: Math.floor(Math.random() * 1000) + 1 + 'kb',
            type: 'Type ' + (event.first + i),
          },
          leaf: false,
        };

        this.files.push(node);
      }
      this.loading = false;
      this.cd.markForCheck();
    }, 1000);
  }

  onNodeExpand(event: any) {
    this.loading = true;

    this.loading = false;
    const node = event.node;

    this.http
      .get<GetDirectoryResponseDto>(`${this.baseUrl}/directory`)
      .subscribe((nodeChildren) => {
        console.log(nodeChildren);
        node.children = nodeChildren.directory;
        this.files = [...this.files];
        this.cd.markForCheck();
      });
  }
}
