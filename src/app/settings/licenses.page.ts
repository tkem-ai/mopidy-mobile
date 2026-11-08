import { Component } from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { TranslatePipe } from '../services/translate.service';
import { ExternalLinkDirective } from '../shared/external-link.directive';

interface License {
  name: string;
  url: string;
  copyright: string;
  license: string;
  licenseUrl: string;
}

const APACHE2 = 'Apache License, Version 2.0';
const MIT = 'MIT License';

const LICENSES: License[] = [
  {
    name: 'Mopidy.js',
    url: 'https://github.com/mopidy/mopidy.js',
    copyright: 'Copyright © 2012-2020 Stein Magnus Jodal and contributors.',
    license: APACHE2,
    licenseUrl: 'https://github.com/mopidy/mopidy.js/blob/main/LICENSE',
  },
  {
    name: 'Ionic',
    url: 'https://ionicframework.com/',
    copyright: 'Copyright © 2015-present Ionic.',
    license: MIT,
    licenseUrl: 'https://github.com/ionic-team/ionic-framework/blob/main/LICENSE',
  },
  {
    name: 'Ionicons',
    url: 'https://ionic.io/ionicons',
    copyright: 'Copyright © 2015-present Ionic.',
    license: MIT,
    licenseUrl: 'https://github.com/ionic-team/ionicons/blob/main/LICENSE',
  },
  {
    name: 'Angular',
    url: 'https://angular.dev/',
    copyright: 'Copyright © 2010-2025 Google LLC.',
    license: MIT,
    licenseUrl: 'https://github.com/angular/angular/blob/main/LICENSE',
  },
  {
    name: 'RxJS',
    url: 'https://rxjs.dev/',
    copyright: 'Copyright © 2015-2018 Google, Inc., Netflix, Inc., Microsoft Corp. and contributors.',
    license: APACHE2,
    licenseUrl: 'https://github.com/ReactiveX/rxjs/blob/master/LICENSE.txt',
  },
  {
    name: 'messageformat',
    url: 'https://messageformat.github.io/',
    copyright: 'Copyright © OpenJS Foundation and contributors.',
    license: MIT,
    licenseUrl: 'https://github.com/messageformat/messageformat/blob/main/LICENSE',
  },
];

@Component({
  selector: 'app-settings-licenses',
  imports: [
    ExternalLinkDirective,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonTitle,
    IonToolbar,
    TranslatePipe,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/settings" [text]="'Back' | translate" />
        </ion-buttons>
        <ion-title>{{ 'Licenses' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        @for (item of licenses; track item.name) {
          <ion-item>
            <ion-label class="ion-text-wrap">
              <h2><a [appExternal]="item.url">{{ item.name }}</a></h2>
              <p>{{ item.copyright }}</p>
              <p><a [appExternal]="item.licenseUrl">{{ item.license }}</a></p>
            </ion-label>
          </ion-item>
        }
      </ion-list>
    </ion-content>
  `,
})
export class LicensesPage {
  readonly licenses = LICENSES;
}
