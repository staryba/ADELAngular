import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ConnectionConfigService } from '../services/connection-config.service';

export const databaseHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const connectionService = inject(ConnectionConfigService);
  const databaseName = connectionService.getDatabaseName();

  // Only add header if we have a database name
  if (databaseName) {
    const clonedRequest = req.clone({
      setHeaders: {
        'X-Database-Name': databaseName
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};
