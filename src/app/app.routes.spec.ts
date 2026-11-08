import { TestBed } from '@angular/core/testing';
import { Router, Routes, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';

import { routes } from './app.routes';

function paths(routes: Routes, prefix = ''): string[] {
  const result: string[] = [];
  for (const route of routes) {
    const path = route.path ? prefix + '/' + route.path : prefix;
    if (route.children) {
      result.push(...paths(route.children, path));
    } else {
      result.push(path || '/');
    }
  }
  return result;
}

describe('routes', () => {
  it('defines all application views', () => {
    expect(paths(routes).sort()).toEqual(
      [
        '/',
        '/**',
        '/library',
        '/library/browse/:uri',
        '/library/lookup/:uri',
        '/library/query',
        '/library/search',
        '/playback',
        '/playlists',
        '/playlists/:uri',
        '/playlists/:uri/edit',
        '/playlists/create',
        '/playlists/edit',
        '/settings',
        '/settings/about',
        '/settings/coverart',
        '/settings/licenses',
        '/settings/logging',
        '/settings/ui',
        '/tracklist',
        '/tracklist/edit',
      ].sort(),
    );
  });

  it('lazily loads a component for every view', () => {
    const check = (routes: Routes) => {
      for (const route of routes) {
        if (route.children) {
          check(route.children);
        } else {
          expect(route.loadComponent || route.redirectTo !== undefined, route.path).toBeTruthy();
        }
      }
    };
    check(routes);
  });

  describe('default route', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    });

    it('shows the playback view', async () => {
      const router = TestBed.inject(Router);
      await router.navigateByUrl('/');
      expect(router.url).toBe('/playback');
    });

    it('redirects unknown URLs to the playback view', async () => {
      const router = TestBed.inject(Router);
      await router.navigateByUrl('/no/such/page');
      expect(router.url).toBe('/playback');
    });
  });
});
