import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { icons } from './icons-provider';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { vi_VN, provideNzI18n } from 'ng-zorro-antd/i18n';
import {
  HashLocationStrategy,
  LocationStrategy,
  registerLocaleData,
} from '@angular/common';
import vi from '@angular/common/locales/vi';
import { FormsModule } from '@angular/forms';

registerLocaleData(vi);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideNzIcons(icons),
    provideNzI18n(vi_VN),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(),
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
};
