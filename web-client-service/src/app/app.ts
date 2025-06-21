import { Component } from '@angular/core';
import { DirectoryLayoutComponent } from './layout/directory-layout/directory-layout.component';

@Component({
  selector: 'app-root',
  imports: [DirectoryLayoutComponent],
  templateUrl: './app.html',
})
export class App {
  protected title = 'web-client-service';
}
