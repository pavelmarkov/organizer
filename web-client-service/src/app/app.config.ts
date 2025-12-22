import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ConnectionsRepository,
  DirectoryRepository,
  NotesRepository,
  ProjectsRepository,
  TagsRepository,
  MemoriesRepository,
} from './core/repositories';
import {
  ConnectionsRepositoryImpl,
  DirectoryRepositoryImpl,
  MemoriesRepositoryImpl,
  NotesRepositoryImpl,
  ProjectsRepositoryImpl,
  TagsRepositoryImpl,
} from './data/repositories';
import {
  ConnectionsService,
  DirectoryService,
  MemoriesService,
  NotesService,
  ProjectsService,
  TagsService,
} from './core/services';
import {
  ProjectInterceptor,
  SearchValueInterceptor,
} from './shared/interceptors';
import {
  DirectoryServiceImpl,
  NotesServiceImpl,
  ProjectsServiceImpl,
  TagsServiceImpl,
  ConnectionsServiceImpl,
  MemoriesServiceImpl,
} from './services';

// import Lara from '@primeng/themes/lara';
// import Nora from '@primeng/themes/nora';
// import Material from '@primeng/themes/material';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),

    provideHttpClient(withInterceptorsFromDi()),

    { provide: HTTP_INTERCEPTORS, useClass: ProjectInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SearchValueInterceptor,
      multi: true,
    },

    { provide: DirectoryRepository, useClass: DirectoryRepositoryImpl },
    { provide: DirectoryService, useClass: DirectoryServiceImpl },

    { provide: NotesRepository, useClass: NotesRepositoryImpl },
    { provide: NotesService, useClass: NotesServiceImpl },

    { provide: ProjectsRepository, useClass: ProjectsRepositoryImpl },
    { provide: ProjectsService, useClass: ProjectsServiceImpl },

    { provide: TagsRepository, useClass: TagsRepositoryImpl },
    { provide: TagsService, useClass: TagsServiceImpl },

    { provide: ConnectionsRepository, useClass: ConnectionsRepositoryImpl },
    { provide: ConnectionsService, useClass: ConnectionsServiceImpl },

    { provide: MemoriesRepository, useClass: MemoriesRepositoryImpl },
    { provide: MemoriesService, useClass: MemoriesServiceImpl },
  ],
};
