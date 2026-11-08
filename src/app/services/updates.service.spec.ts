import { TestBed } from '@angular/core/testing';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { Subject } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LoggingService } from './logging.service';
import { UpdatesService } from './updates.service';

describe('UpdatesService', () => {
  let swUpdate: {
    isEnabled: boolean;
    versionUpdates: Subject<VersionEvent>;
    unrecoverable: Subject<{ type: 'UNRECOVERABLE_STATE'; reason: string }>;
  };
  let logging: LoggingService;
  let service: UpdatesService;

  beforeEach(() => {
    vi.spyOn(console, 'debug').mockImplementation(() => undefined);
    vi.spyOn(console, 'info').mockImplementation(() => undefined);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    swUpdate = { isEnabled: true, versionUpdates: new Subject(), unrecoverable: new Subject() };
    TestBed.configureTestingModule({ providers: [{ provide: SwUpdate, useValue: swUpdate }] });
    logging = TestBed.inject(LoggingService);
    vi.spyOn(logging, 'debug');
    vi.spyOn(logging, 'info');
    vi.spyOn(logging, 'error');
    service = TestBed.inject(UpdatesService);
    vi.spyOn(service, 'reload').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does nothing when the service worker is not available', () => {
    swUpdate.isEnabled = false;
    service.init();
    expect(logging.debug).toHaveBeenCalledWith('Service worker not available');
    expect(swUpdate.versionUpdates.observed).toBe(false);
    expect(swUpdate.unrecoverable.observed).toBe(false);
  });

  it('logs version updates', () => {
    service.init();
    const version = { hash: 'abc', appData: undefined };
    swUpdate.versionUpdates.next({ type: 'VERSION_DETECTED', version });
    expect(logging.info).toHaveBeenCalledWith('Downloading new application version');
    swUpdate.versionUpdates.next({ type: 'VERSION_READY', currentVersion: version, latestVersion: version });
    expect(logging.info).toHaveBeenCalledWith('New application version ready; restart to update');
    swUpdate.versionUpdates.next({ type: 'NO_NEW_VERSION_DETECTED', version });
    expect(logging.info).toHaveBeenCalledTimes(2);
    expect(service.reload).not.toHaveBeenCalled();
  });

  it('logs failed installations', () => {
    service.init();
    swUpdate.versionUpdates.next({
      type: 'VERSION_INSTALLATION_FAILED',
      version: { hash: 'abc', appData: undefined },
      error: 'hash mismatch',
    });
    expect(logging.error).toHaveBeenCalledWith('Error installing new application version:', 'hash mismatch');
  });

  it('reloads the application from an unrecoverable state', () => {
    service.init();
    swUpdate.unrecoverable.next({ type: 'UNRECOVERABLE_STATE', reason: 'cache evicted' });
    expect(logging.error).toHaveBeenCalledWith('Service worker error: cache evicted');
    expect(service.reload).toHaveBeenCalledTimes(1);
  });
});
