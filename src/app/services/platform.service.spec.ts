import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PlatformService } from './platform.service';

describe('PlatformService', () => {
  let service: PlatformService;

  beforeEach(() => {
    service = TestBed.inject(PlatformService);
  });

  afterEach(() => {
    document.body.removeAttribute('data-web-socket-url');
    document.body.removeAttribute('data-version');
    vi.restoreAllMocks();
  });

  it('reads the WebSocket URL and version from the document', async () => {
    document.body.setAttribute('data-web-socket-url', 'ws://host:6680/mopidy/ws');
    document.body.setAttribute('data-version', '2.0.0');
    expect(service.webSocketUrl()).toBe('ws://host:6680/mopidy/ws');
    await expect(service.appVersion()).resolves.toBe('2.0.0');
  });

  it('uses the default WebSocket when the URL is empty', () => {
    document.body.setAttribute('data-web-socket-url', '');
    expect(service.webSocketUrl()).toBeNull();
  });

  it('uses the default WebSocket and a development version when not configured', async () => {
    expect(service.webSocketUrl()).toBeNull();
    await expect(service.appVersion()).resolves.toBe('develop');
  });

  it('opens external links in a new window', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    service.openExternal('https://example.com/');
    expect(open).toHaveBeenCalledWith('https://example.com/', '_blank', 'noopener');
  });

  it('starts without a version', () => {
    expect(service.version()).toBe('');
  });
});
