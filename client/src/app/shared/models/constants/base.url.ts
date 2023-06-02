import { InjectionToken } from '@angular/core';

export const BASE_URL_VALUE = window.location.origin;

export const BASE_URL = new InjectionToken<string>('base.url', {
  providedIn: 'root',
  factory: () => BASE_URL_VALUE,
});
