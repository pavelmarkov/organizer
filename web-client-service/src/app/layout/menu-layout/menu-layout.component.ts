import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { ProjectsService } from '../../core/services';
import { DataService } from '../../shared/services/data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu-layout',
  imports: [Menubar],
  templateUrl: './menu-layout.component.html',
  styleUrl: './menu-layout.component.css',
})
export class MenuLayoutComponent implements OnInit {
  items: MenuItem[] = [];
  projectName: string | null = null;
  section: string | undefined;

  private route = inject(ActivatedRoute);

  constructor(
    private projectsService: ProjectsService,
    private dataService: DataService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Directory',
        icon: 'pi pi-briefcase',
        routerLink: './directory',
        command: (event: MenuItemCommandEvent) => {
          this.section = event.item?.label;
        },
      },
      {
        label: 'Notes',
        icon: 'pi pi-book',
        routerLink: 'notes',
        command: (event: MenuItemCommandEvent) => {
          this.section = event.item?.label;
        },
      },
      {
        label: 'Tags',
        icon: 'pi pi-hashtag',
        routerLink: 'tags',
        command: (event: MenuItemCommandEvent) => {
          this.section = event.item?.label;
        },
      },
      {
        label: 'Memories',
        icon: 'pi pi-hashtag',
        routerLink: 'memories',
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
            this.projectName = project.name;
            this.dataService.setProject(project.projectId);
          },
          state: {
            projectId: project.projectId,
          },
        });
      });

      const defaultProject = data.find((project) => project.default);
      if (defaultProject) {
        this.dataService.setProjectIfNotSet(defaultProject.projectId);
      }

      this.items = [
        ...this.items,
        {
          label: 'Projects',
          icon: 'pi pi-key',
          items: projectItems,
        },
      ];

      this.cd.markForCheck();
    });
  }
}
