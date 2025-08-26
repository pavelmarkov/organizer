import { Routes } from '@angular/router';
import { DirectoryLayoutComponent } from './layout/directory-layout/directory-layout.component';
import { NotesLayoutComponent } from './layout/notes-layout/notes-layout.component';

export const routes: Routes = [
  { path: 'directory', component: DirectoryLayoutComponent },
  { path: 'notes', component: NotesLayoutComponent },
];
