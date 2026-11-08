import {
  ApplicationConfig,
  ErrorHandler,
  inject,
  isDevMode,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { PreloadAllModules, RouteReuseStrategy, provideRouter, withHashLocation, withPreloading } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app.routes';
import { registerIcons } from './icons';
import { AppErrorHandler } from './services/logging.service';
import { StartupService } from './startup.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideIonicAngular(),
    provideRouter(routes, withHashLocation(), withPreloading(PreloadAllModules)),
    // service workers are only available in secure contexts, i.e. via
    // HTTPS or on localhost; the URL is relative to the document, so the
    // worker's scope is the Web extension's path, e.g. /mobile/
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideAppInitializer(() => {
      registerIcons();
      inject(StartupService).init();
    }),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: ErrorHandler, useClass: AppErrorHandler },
  ],
};
