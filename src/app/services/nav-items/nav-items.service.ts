import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavItemsService {
  private apiUrl = '10.232.236.15:8092/api/dataTables'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      cmd: 111,
    };

    return this.http.post<any>(this.apiUrl, body, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return new Observable<never>();
  }
}
