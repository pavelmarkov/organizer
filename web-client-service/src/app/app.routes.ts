import { Routes } from '@angular/router';
import { DirectoryLayoutComponent } from './layout/directory-layout/directory-layout.component';
import { NotesLayoutComponent } from './layout/notes-layout/notes-layout.component';
import { TagsLayoutComponent } from './layout/tags-layout/tags-layout.component';
import { MemoriesLayoutComponent } from './layout/memories-layout/memories-layout.component';

export const routes: Routes = [
  { path: 'directory', component: DirectoryLayoutComponent },
  { path: 'directory/:id', component: DirectoryLayoutComponent },
  { path: 'notes', component: NotesLayoutComponent },
  { path: 'tags', component: TagsLayoutComponent },
  { path: 'memories', component: MemoriesLayoutComponent },
];
