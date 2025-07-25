import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

import { ToolbarModule } from 'primeng/toolbar';
import { MenuItem } from 'primeng/api';
import { SplitButton } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { DataService } from '../../shared/services/data.service';
import { SelectedNodesType } from '../../core/types';

@Component({
  selector: 'app-actions-layout',
  imports: [
    ButtonModule,
    DividerModule,

    ToolbarModule,
    SplitButton,
    InputTextModule,
    IconField,
    InputIcon,
  ],
  templateUrl: './actions-layout.component.html',
  styleUrl: './actions-layout.component.css',
})
export class ActionsLayoutComponent implements OnInit {
  items: MenuItem[] | undefined;
  selectedNodes: SelectedNodesType = {};

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Update',
        icon: 'pi pi-refresh',
      },
      {
        label: 'Delete',
        icon: 'pi pi-times',
      },
    ];
    this.dataService.currentSelectedNodes.subscribe((data) => {
      this.selectedNodes = data;
    });
  }

  processNodes(event: any) {
    console.log('Nodes to process: ', this.selectedNodes);
  }
}
