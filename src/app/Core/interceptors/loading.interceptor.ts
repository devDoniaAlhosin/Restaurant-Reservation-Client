import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../services/busyService/busy.service';
import { delay, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
const busyService = inject(BusyService);
  busyService.busy();
  return next(req).pipe(
    delay(200),
    finalize(() => busyService.idle())
  );
};
