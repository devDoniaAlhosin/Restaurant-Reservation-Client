import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouterLinkActive } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    RouterLinkActive,

  ],

}
