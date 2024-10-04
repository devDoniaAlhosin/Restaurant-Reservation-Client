import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouterLinkActive, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { loadingInterceptor } from './Core/interceptors/loading.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes  , withViewTransitions() , withComponentInputBinding() ),
    provideHttpClient(),
    RouterLinkActive,

    provideHttpClient(), provideAnimationsAsync(),
    provideHttpClient(withInterceptors([loadingInterceptor])),
    importProvidersFrom([BrowserAnimationsModule])
  ],

}
