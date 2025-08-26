import { Component, OnInit } from '@angular/core';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { Menubar } from 'primeng/menubar';

@Component({
  selector: 'app-menu-layout',
  imports: [Menubar],
  templateUrl: './menu-layout.component.html',
  styleUrl: './menu-layout.component.css',
})
export class MenuLayoutComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: 'directory',
      },
      {
        label: 'Notes',
        icon: 'pi pi-star',
        routerLink: 'notes',
      },
      {
        label: 'Projects',
        icon: 'pi pi-search',
        items: [
          {
            label: 'Project 1',
            icon: 'pi pi-bolt',
            command: this.chooseProject,
            state: {
              some: 'state',
            },
          },
          {
            label: 'Project 2',
            icon: 'pi pi-bolt',
          },
          {
            label: 'Project 3',
            icon: 'pi pi-bolt',
          },
        ],
      },
    ];
  }

  chooseProject(event: MenuItemCommandEvent) {
    console.log(event);
  }
}
