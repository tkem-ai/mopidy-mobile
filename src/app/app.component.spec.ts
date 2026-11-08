import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AppComponent } from './app.component';
import { LoadingService } from './services/loading.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), provideIonicAngular()],
    }).compileComponents();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the router outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('ion-app ion-router-outlet')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.app-loading')).toBeNull();
  });

  it('shows the loading indicator while loading', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const loading = TestBed.inject(LoadingService);
    loading.show();
    vi.advanceTimersByTime(100);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.app-loading ion-spinner')).not.toBeNull();
    loading.hide();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.app-loading')).toBeNull();
  });
});
