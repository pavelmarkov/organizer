import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuLayoutComponent } from './layout/menu-layout/menu-layout.component';

@Component({
  selector: 'app-root',
  imports: [MenuLayoutComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'web-client-service';
}
