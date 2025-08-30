import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  DirectoryRepository,
  NotesRepository,
  ProjectsRepository,
} from './core/repositories';
import {
  DirectoryRepositoryImpl,
  NotesRepositoryImpl,
  ProjectsRepositoryImpl,
} from './data/repositories';
import {
  DirectoryService,
  NotesService,
  ProjectsService,
} from './core/services';
import { ProjectInterceptor } from './shared/interceptors';

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

    { provide: DirectoryRepository, useClass: DirectoryRepositoryImpl },
    { provide: DirectoryService, useClass: DirectoryRepositoryImpl },

    { provide: NotesRepository, useClass: NotesRepositoryImpl },
    { provide: NotesService, useClass: NotesRepositoryImpl },

    { provide: ProjectsRepository, useClass: ProjectsRepositoryImpl },
    { provide: ProjectsService, useClass: ProjectsRepositoryImpl },
  ],
};
