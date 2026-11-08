import { Injectable, inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

import { LoggingService } from './logging.service';

/**
 * Application updates via the service worker.
 *
 * New versions are downloaded in the background and used when the
 * application is loaded the next time, e.g. via "Restart".
 */
@Injectable({ providedIn: 'root' })
export class UpdatesService {
  private readonly logging = inject(LoggingService);
  private readonly updates = inject(SwUpdate);

  init(): void {
    if (!this.updates.isEnabled) {
      this.logging.debug('Service worker not available');
      return;
    }
    this.updates.versionUpdates.subscribe((event) => {
      switch (event.type) {
        case 'VERSION_DETECTED':
          this.logging.info('Downloading new application version');
          break;
        case 'VERSION_READY':
          this.logging.info('New application version ready; restart to update');
          break;
        case 'VERSION_INSTALLATION_FAILED':
          this.logging.error('Error installing new application version:', event.error);
          break;
      }
    });
    this.updates.unrecoverable.subscribe((event) => {
      // the cached version is broken and cannot be updated, so reload
      // the application from the server
      this.logging.error('Service worker error: ' + event.reason);
      this.reload();
    });
  }

  /** Reload the application. */
  reload(): void {
    document.location.reload();
  }
}
