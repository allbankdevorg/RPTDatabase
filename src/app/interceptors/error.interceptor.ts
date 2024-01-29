import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';


export class ErrorInterceptor implements HttpInterceptor {
    constructor() {}
  
    intercept(
      request: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            // Client-side error
            console.error('An error occurred:', error.error.message);
          } else {
            // Server-side error
            console.error(
              `Backend returned code ${error.status}, ` +
              `body was: ${error.error}`
            );
          }
  
          if (error.error.code === 'ERR_CONNECTION_REFUSED') {
            // Notify user about server connection error
            Swal.fire({
              icon: 'error',
              title: 'Connection Error',
              text: 'Failed to connect to the server. Please try again later.'
            });
          }
  
          return throwError(error);
        })
      );
    }
  }