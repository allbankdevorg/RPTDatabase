import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpResponse, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrptService {

  private ORPTApiUrl = `${environment.apiBaseUrl}/api`;


  constructor(private http: HttpClient) { }


  getORPT(cmd: number): Observable<{ result: { message: string; Data: any[] }[] }> {
    return this.http.post<{ result: { message: string; Data: any[] }[] }>(`${this.ORPTApiUrl}/dataTables`, { cmd });
  }



  addORPT(data: any): Observable<any> {
    const headers = new HttpHeaders({
      // Remove 'Content-Type' header as Angular will set it automatically for JSON
    });
    
    console.log(data);

    return this.http.post<any>(`${this.ORPTApiUrl}/addData`, data, { headers });
  }


  updateORPT(id: number, data: any): Observable<any> {
    const headers = new HttpHeaders({
      // 'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.ORPTApiUrl}/updateData`, data, { headers })
      .pipe(
        // You could add global error handling here if needed
        catchError(error => {
          // Log the error for debugging
          console.error('Service error:', error);
          return throwError(() => error);
        })
      );
  }



 deleteORPT (data: any): Observable<any> {
    const headers = new HttpHeaders({
      // 'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.ORPTApiUrl}/updateData`, data, { headers })
      .pipe(
        // You could add global error handling here if needed
        catchError(error => {
          // Log the error for debugging
          console.error('Service error:', error);
          return throwError(() => error);
        })
      );
  }


 
}
