import { Injectable } from '@angular/core';

export type Theme = 'light' | 'dark';

export interface Settings {
  action: string;
  coverart: string[];
  debug: boolean;
  locale: string;
  theme: Theme;
  timeout: number;
}

export const DEFAULT_SETTINGS: Settings = {
  action: 'play',
  coverart: ['mopidy'],
  debug: false,
  locale: '',
  theme: 'light',
  timeout: 15000,
};

/** Settings of previous versions which are no longer used. */
const OBSOLETE_SETTINGS = ['server', 'servers', 'volumestep'];

const KEY = 'mopidy-mobile';

function getStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Persistent user settings, stored as a single JSON object. */
@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly storage = getStorage();

  get(): Settings {
    return { ...DEFAULT_SETTINGS, ...this.read() };
  }

  extend(src: Partial<Settings>): Settings {
    const obj = { ...this.read(), ...src };
    this.write(obj);
    return { ...DEFAULT_SETTINGS, ...obj };
  }

  clear(): void {
    this.storage?.removeItem(KEY);
  }

  /** Migrate settings stored by previous versions. */
  migrate(): void {
    const storage = this.storage;
    if (!storage) {
      return;
    }
    // pre-1.4 settings were stored as separate keys
    storage.removeItem(`${KEY}.servers`);
    for (const item of ['action', 'locale', 'stylesheet']) {
      const key = `${KEY}.${item}`;
      const value = storage.getItem(key);
      if (value !== null) {
        try {
          this.write({ ...this.read(), [item]: JSON.parse(value) });
        } catch {
          // ignore invalid values
        }
        storage.removeItem(key);
      }
    }
    // pre-2.0 settings stored the theme as a stylesheet URL
    const obj = this.read();
    let changed = false;
    const stylesheet = obj['stylesheet'];
    if (typeof stylesheet === 'string') {
      if (!obj['theme']) {
        obj['theme'] = stylesheet.includes('dark') ? 'dark' : 'light';
      }
      delete obj['stylesheet'];
      changed = true;
    }
    // remove settings of the former Cordova app
    for (const item of OBSOLETE_SETTINGS) {
      if (item in obj) {
        delete obj[item];
        changed = true;
      }
    }
    if (changed) {
      this.write(obj);
    }
  }

  private read(): Record<string, unknown> {
    try {
      return JSON.parse(this.storage?.getItem(KEY) || '{}') || {};
    } catch {
      return {};
    }
  }

  private write(obj: Record<string, unknown>): void {
    this.storage?.setItem(KEY, JSON.stringify(obj));
  }
}
