import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient()
  ]
};

// FIXME: Estudar todos esses providers.
// Foi necessário importar aqui em app.config o "provideHttpClient", porque não estava abrindo mais a página "/create" e estava aparecendo os seguintes erros no console:
// NullInjectorError: No provider for _HttpClient!
// Circular dependency in DI detected for _ApiService
