import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideHttpClient } from '@angular/common/http';
import { DirectoryRepository, NotesRepository } from './core/repositories';
import { DirectoryRepositoryImpl } from './data/repositories/directory.repository.impl';
import { DirectoryService, NotesService } from './core/services';
import { NotesRepositoryImpl } from './data/repositories/notes.repository.impl';
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

    provideHttpClient(),

    { provide: DirectoryRepository, useClass: DirectoryRepositoryImpl },
    { provide: DirectoryService, useClass: DirectoryRepositoryImpl },

    { provide: NotesRepository, useClass: NotesRepositoryImpl },
    { provide: NotesService, useClass: NotesRepositoryImpl },
  ],
};
