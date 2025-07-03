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

    setTimeout(() => {
      this.loading = false;
      const node = event.node;

      this.http
        .get<TreeNode[]>(`${this.baseUrl}/directory`)
        .subscribe((something) => {
          console.log(something);
        });
      node.children = [
        {
          data: {
            name: node.data.name + ' - 0',
            size: Math.floor(Math.random() * 1000) + 1 + 'kb',
            type: 'File',
          },
        },
        {
          data: {
            name: node.data.name + ' - 1',
            size: Math.floor(Math.random() * 1000) + 1 + 'kb',
            type: 'File',
          },
        },
      ];

      this.files = [...this.files];
      this.cd.markForCheck();
    }, 250);
  }
}
