import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { treeReducer } from './store/tree/tree.reducer';
import { TreeEffects } from './store/tree/tree.effects';
import { databaseHeaderInterceptor } from './interceptors/database-header.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([databaseHeaderInterceptor])),
    provideStore({ tree: treeReducer }),
    provideEffects([TreeEffects]),
    provideStoreDevtools({ maxAge: 25 })
  ]
};
