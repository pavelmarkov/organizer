import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DirectoryLayoutComponent } from './layout/directory-layout/directory-layout.component';
import { ActionsLayoutComponent } from './layout/actions-layout/actions-layout.component';

@Component({
  selector: 'app-root',
  imports: [DirectoryLayoutComponent, ActionsLayoutComponent], // RouterOutlet,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'web-client-service';
}
