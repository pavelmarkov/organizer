import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { TreeTableModule } from 'primeng/treetable';
import { TreeNode } from 'primeng/api';
import { CommonModule } from '@angular/common';

interface IDummyData {
  name: string;
  size: string;
  type: string;
}

interface Column {
  field: string;
  header: string;
}

const dummyData: TreeNode<IDummyData>[] = [
  {
    data: {
      name: '1',
      size: '1',
      type: 'type',
    },
    children: [
      {
        data: {
          name: '1',
          size: '1',
          type: 'type',
        },
      },
    ],
  },
];

@Component({
  selector: 'app-directory-layout',
  imports: [TreeTableModule, CommonModule],
  templateUrl: './directory-layout.component.html',
  styleUrl: './directory-layout.component.css',
})
export class DirectoryLayoutComponent implements OnInit {
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
