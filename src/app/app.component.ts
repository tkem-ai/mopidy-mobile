import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, IonSpinner } from '@ionic/angular/standalone';

import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  imports: [IonApp, IonRouterOutlet, IonSpinner],
  template: `
    <ion-app>
      <ion-router-outlet />
      @if (loading.active()) {
        <div class="app-loading">
          <div class="app-loading-indicator"><ion-spinner /></div>
        </div>
      }
    </ion-app>
  `,
})
export class AppComponent {
  readonly loading = inject(LoadingService);
}
