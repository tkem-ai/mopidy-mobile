import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MockConnectionService, provideMockConnection } from '../testing/connection';
import { flush } from '../testing/dom';
import { LoggingService } from './services/logging.service';
import { PlatformService } from './services/platform.service';
import { PreferencesService } from './services/preferences.service';
import { SettingsService } from './services/settings.service';
import { StartupService } from './startup.service';

describe('StartupService', () => {
  let connection: MockConnectionService;
  let platform: Record<string, unknown>;
  let order: string[];
  let logging: LoggingService;

  beforeEach(() => {
    vi.spyOn(console, 'info').mockImplementation(() => undefined);
    order = [];
    connection = new MockConnectionService();
    platform = {
      webSocketUrl: vi.fn().mockReturnValue(null),
      appVersion: vi.fn().mockResolvedValue('2.0.0'),
      version: signal(''),
    };
    TestBed.configureTestingModule({
      providers: [
        provideMockConnection(connection),
        { provide: PlatformService, useValue: platform },
        { provide: PreferencesService, useValue: { applyAll: vi.fn(() => order.push('applyAll')) } },
        { provide: SettingsService, useValue: { migrate: vi.fn(() => order.push('migrate')) } },
      ],
    });
    logging = TestBed.inject(LoggingService);
    vi.spyOn(logging, 'info');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function init(): StartupService {
    const service = TestBed.inject(StartupService);
    service.init();
    return service;
  }

  it('migrates settings before applying preferences', () => {
    init();
    expect(order).toEqual(['migrate', 'applyAll']);
  });

  it('logs and publishes the application version', async () => {
    init();
    await flush();
    expect(logging.info).toHaveBeenCalledWith('Starting Mopidy Mobile 2.0.0');
    expect((platform['version'] as ReturnType<typeof signal<string>>)()).toBe('2.0.0');
  });

  it("connects to the hosting server's default WebSocket", () => {
    init();
    expect(connection.reset).toHaveBeenCalledWith(null);
  });

  it('connects to the configured WebSocket URL', () => {
    (platform['webSocketUrl'] as ReturnType<typeof vi.fn>).mockReturnValue('ws://host:6680/mopidy/ws');
    init();
    expect(connection.reset).toHaveBeenCalledWith('ws://host:6680/mopidy/ws');
  });
});
