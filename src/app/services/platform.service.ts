import { Injectable, signal } from '@angular/core';

/**
 * Information provided by the hosting Mopidy server, which renders
 * mopidy_mobile/www/index.html as a template.
 */
@Injectable({ providedIn: 'root' })
export class PlatformService {
  /** The application version, once known. */
  readonly version = signal('');

  /**
   * The WebSocket URL configured for the Web extension, or null to use
   * the hosting server's default WebSocket.
   */
  webSocketUrl(): string | null {
    return document.body.getAttribute('data-web-socket-url') || null;
  }

  async appVersion(): Promise<string> {
    return document.body.getAttribute('data-version') || 'develop';
  }

  /** Open a URL in a new browser window. */
  openExternal(url: string): void {
    window.open(url, '_blank', 'noopener');
  }
}
