import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { ProjectsService } from '../../core/services';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-menu-layout',
  imports: [Menubar],
  templateUrl: './menu-layout.component.html',
  styleUrl: './menu-layout.component.css',
})
export class MenuLayoutComponent implements OnInit {
  items: MenuItem[] = [];
  projectId: string | null = null;
  section: string | undefined;

  constructor(
    private projectsService: ProjectsService,
    private dataService: DataService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: './directory',
        command: (event: MenuItemCommandEvent) => {
          this.section = event.item?.label;
        },
      },
      {
        label: 'Notes',
        icon: 'pi pi-star',
        routerLink: 'notes',
        command: (event: MenuItemCommandEvent) => {
          this.section = event.item?.label;
        },
      },
    ];

    this.projectsService.getProjects().subscribe((data) => {
      const projectItems: MenuItem[] = [];
      data?.forEach((project) => {
        projectItems.push({
          label: project.name,
          icon: 'pi pi-bolt',
          command: (event: MenuItemCommandEvent) => {
            this.projectId = project.name;
            this.dataService.setProject(project.projectId);
          },
          state: {
            projectId: project.projectId,
          },
        });
      });

      this.items = [
        ...this.items,
        {
          label: 'Projects',
          icon: 'pi pi-search',
          items: projectItems,
        },
      ];

      this.cd.markForCheck();
    });
  }
}
