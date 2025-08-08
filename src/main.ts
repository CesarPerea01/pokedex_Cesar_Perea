import {
  bootstrapApplication,
  provideProtractorTestingSupport,
} from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import routes from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
    provideProtractorTestingSupport(),
    provideRouter(routes),
  ],
}).catch((err) => console.error(err));
